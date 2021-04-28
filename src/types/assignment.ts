export enum ZyContentType {
    lab = "lab",
    participation = "participation",
    challenge = "challenge"
}

export enum ZyResourceType {
    programming_submission = "programming_submission",
    custom = "custom",
    short_answer = "short_answer",
    multiple_choice = "multiple_choice"
}

export enum ZyToolType {
    pythonTutor = "pythonTutor",
    codeOutput = "codeOutput",
    homeworkSystem = "homeworkSystem",
    zyAnimator = "zyAnimator",
    inheritanceTree = "inheritanceTree"
}

export interface ZyContentResourceMetadata {
    activity_type: ZyContentType;
    canonical_section_id?: number;
    caption: string;
    content_resource_id: string;
    max_score?: number;
    parts?: number;
    payload: string;
    resource_type: string;
    tool?: ZyToolType;
    type: ZyResourceType;
}

export interface ZySectionActivityData {
    activity_data: number[];
    activity_num: number;
    content_resource_metadata: ZyContentResourceMetadata;
}

export interface ZyAssignmentActivityData {
    chapter_number: number;
    section_activity_data: ZySectionActivityData[];
    section_id: number;
    section_number: number;
}

export interface ZyAssignmentGroup {
    assignment_due_date_group_id: number;
    assignment_due_date_id: number;
    label: string;
    section_id: number | null;
    type: string;
    user_id: number | null;
}

export interface ZyAssignmentDueDate {
    assignment_due_date_id: number;
    assignment_id: number;
    /** ISO-formatted date */
    date: string;
    groups: ZyAssignmentGroup[];
}

export interface ZyAssignmentSection {
    canonical_section_id: number;
    chapter_number: number;
    include_challenges: number;
    include_labs: number;
    include_participations: number;
    section_number: number;
    title: string;
    total_points: number;
}

export interface ZyAssignment {
    activity_data: ZyAssignmentActivityData[];
    assignment_id: number;
    creator_user_id: number;
    due_dates: ZyAssignmentDueDate[];
    lti_consumer_resources: unknown;
    points_recorded_in_lms: unknown;
    sections: ZyAssignmentSection[];
    submission_link_available: boolean;
    title: string;
    visible: number;
    zybook_id: number;
}