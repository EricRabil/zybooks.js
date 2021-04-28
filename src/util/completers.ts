import { AxiosInstance } from "axios";
import { ZyContentResourceMetadata } from "../types/assignment";
import { ZyFullBook } from "../types/book";
import { createZyChecksum } from "./checksum";

export interface ZyCompletionContext {
    axios: AxiosInstance;
    auth_token: string;
    book: ZyFullBook;
    serverKey: string;
}

export interface ZyAssignmentContext extends ZyCompletionContext {
    contentResourceID: number;
    activityID: number;
    timestamp?: string;
    metadata: string;
}

export async function completePythonTutor({ axios, auth_token, book, contentResourceID, activityID, metadata, serverKey, timestamp = new Date().toISOString() }: ZyAssignmentContext) {
    await axios.post(`content_resource/${contentResourceID}/activity`, {
        auth_token,
        complete: true,
        metadata,
        part: 0,
        timestamp,
        zybook_code: book.zybook_code,
        __cs__: createZyChecksum(activityID, timestamp, auth_token, serverKey)
    });
}