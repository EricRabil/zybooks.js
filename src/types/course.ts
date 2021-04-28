export interface ZyInstitution {
    institution_id: number;
    institution_type: string;
    metadata: object;
    name: string;
    num_enrolled_full_time: number | null;
    salesforce_account_id: string;
    system_term: string;
}

export interface ZyCourse {
    course_call_number: string;
    name: string;
}

export interface ZyFullCourse extends ZyCourse {
    course_id: number;
    institution: ZyInstitution;
    metadata: unknown;
    salesforce_course_id: string;
}