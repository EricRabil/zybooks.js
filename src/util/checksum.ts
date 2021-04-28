import crypto from "crypto";
import { ZyAssignment, ZyAssignmentActivityData, ZyContentResourceMetadata, ZySectionActivityData } from "../types/assignment";

function resourceMetadataChecksum({ content_resource_metadata: metadata, activity_data: parts }: ZySectionActivityData): string {
    return "".concat(metadata.content_resource_id).concat(parts.join(""));
}

function assignmentActivityChecksum({ section_activity_data }: ZyAssignmentActivityData) {
    return section_activity_data.map(data => resourceMetadataChecksum(data)).join("");
}

// we got checklsum working
export function assignmentChecksum({ activity_data }: ZyAssignment): string {
    return activity_data.sort((d1, d2) => d1.section_number - d2.section_number).map(data => assignmentActivityChecksum(data)).join("");
}

export function createZyChecksum(activityID: number, timestamp: string, token: string, serverKey: string): string {
    const md5 = crypto.createHash("md5");
    md5.update(JSON.stringify(`content_resource/${activityID}/activity`));
    md5.update(JSON.stringify(timestamp));
    md5.update(JSON.stringify(token));
    md5.update(JSON.stringify(serverKey));
    return md5.digest("hex");
}