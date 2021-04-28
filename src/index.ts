import dotenv from "dotenv";
import { ZyClient } from "./client";
import inquirer from "inquirer";
import { localStorage } from "./util/localStorage";
import { ZyBook } from "./types/book";
import { ZyAssignment, ZyAssignmentActivityData, ZyAssignmentSection, ZyContentType, ZySectionActivityData, ZyToolType } from "./types/assignment";
import { ZySection } from "./types/chapter";
import { getBuildKey } from "./util/build-key";
import { assignmentChecksum } from "./util/checksum";

dotenv.config();

const email = process.env.ZY_EMAIL!;
const password = process.env.ZY_PASSWORD!;

const client = new ZyClient(email, password);

async function books(): Promise<ZyBook[]> {
    const cached = localStorage.getItem("books");
    if (cached) return JSON.parse(cached);
    const books = await client.books();
    localStorage.setItem("books", JSON.stringify(books));
    return books;
}

async function getAssignments(code: string): Promise<ZyAssignment[]> {
    const cached = localStorage.getItem(`assignments-${code}`);
    if (cached) return JSON.parse(cached);
    const assignments = await client.assignments(code);
    localStorage.setItem(`assignments-${code}`, JSON.stringify(assignments));
    return assignments;
}

function earnedAssignmentSectionPoints(section: ZyAssignmentActivityData): number {
    return section?.section_activity_data.flatMap(data => {
        if (data.content_resource_metadata.activity_type !== ZyContentType.lab) return data.activity_data;

        const multiplier = Math.pow(10, +(data.content_resource_metadata.max_score!).toExponential().split("e+")[1])
        return data.activity_data.map(score => score * multiplier);
    }).reduce((acc, c) => acc + c, 0) || 0;
}

function assignmentScore({ sections, activity_data }: ZyAssignment): [number, number] {
    const totalPoints = sections.reduce((acc, { total_points }) => acc + total_points, 0);
    const earnedPoints = sections.reduce((acc, _, index) => acc + earnedAssignmentSectionPoints(activity_data[index]), 0);

    return [earnedPoints, totalPoints];
}

function assignmentIsFinished(assignment: ZyAssignment) {
    const [ earned, total ] = assignmentScore(assignment);

    return earned === total;
}

(async () => {
    // await client.login();

    const courses = await books();

    const { courseCode } = await inquirer.prompt({
        type: "list",
        choices: courses.map(course => ({ name: course.title, value: course.zybook_code })),
        message: "Which course are we working on?",
        name: "courseCode"
    });

    const rawAssignments = await getAssignments(courseCode);
    let assignments = rawAssignments.slice().sort((assignment1, assignment2) => Date.parse(assignment1.due_dates[0].date) - Date.parse(assignment2.due_dates[0].date));
    assignments = assignments.filter(assignment => !assignmentIsFinished(assignment));
    assignments = assignments.filter(assignment => Date.parse(assignment.due_dates[0].date) > Date.now());

    rawAssignments.forEach(ass => ass.sections.sort((s1, s2) => s1.section_number - s2.section_number));
    rawAssignments.sort((a1,a2) => a1.sections[0].chapter_number - a2.sections[0].chapter_number);
    console.log(rawAssignments.length)

    process.exit();

    const { assignment } = await inquirer.prompt({
        type: "list",
        choices: assignments.map(assignment => {
            const [ earned, total ] = assignmentScore(assignment);

            return { name: `${assignment.title} – ${earned} / ${total} pts – Due ${new Date(assignment.due_dates[0].date)}`, value: assignment }
        }),
        message: "Which assignment are we working on?",
        name: "assignment"
    }) as { assignment: ZyAssignment };
    
    const { sectionIndex } = await inquirer.prompt({
        type: "list",
        choices: assignment.sections.map((section, index) => {
            const earned = earnedAssignmentSectionPoints(assignment.activity_data[index]);

            return { name: `${section.title} – ${earned} / ${section.total_points} pts`, value: index };
        }),
        message: "Which section are we working on?",
        name: "sectionIndex"
    }) as { sectionIndex: number };

    assignment.activity_data.sort(({ section_number: section_number1 }, { section_number: section_number2 }) => section_number1 - section_number2);

    const activities = assignment.activity_data[sectionIndex].section_activity_data;

    const { activity } = await inquirer.prompt({
        type: "list",
        choices: activities.map(activity => {
            return {
                name: `${activity.content_resource_metadata.caption} – tool:${activity.content_resource_metadata.tool} – type:${activity.content_resource_metadata.resource_type}`,
                value: activity
            }
        }),
        message: "Which activity are we doing?",
        name: "activity"
    }) as { activity: ZySectionActivityData };
})();