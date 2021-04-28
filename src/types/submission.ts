export interface ZySubmission {
    /** ISO-formatted date */
    date_submitted: string;
    max_score: number;
    programming_submission_id: number;
    /** JSON-compliant payload */
    result: string;
    score: number;
    user_id: number;
    /** download URL */
    zip_location: string;
}

export interface ZyGradingCriteria {
    comment: string;
    description: string;
    label: string;
    max_score: number;
    score: number;
    type: string;
    user_id: number;
    zylab_manual_test_id: number;
}