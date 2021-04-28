import { ZyCourse, ZyFullCourse } from "./course";
import { ZySubscription, ZySubscriptionInfo } from "./billing";
import { ZyChapter, ZySection } from "./chapter";
import { ZySubject, ZyTerm } from "./tagging";

export interface ZyBookBase {
    academic_term: ZyTerm;
    autosubscribe: boolean;
    development: boolean;
    public: boolean;
    snippet: string;
    subjects: ZySubject[];
    title: string;
    zybook_code: string;
    zybook_id: number;
    zylabs_enabled: boolean;
}

export interface ZyBookMetadata {
    autoSubmitAssignments: boolean;
    disableTestBanks: boolean;
    enableActivityTimeTracking: boolean;
    enableAnalyticsDashboard: boolean;
    enableDeferralRequests: boolean;
    instructorCreatedContentEnabled: boolean;
    showFullTestBankInEvaluation: boolean;
    showGenericZylabs: boolean;
    showSQLzylabs: boolean;
    zylabManualGradingEnabled: boolean;
    zylabSignatureEnabled: boolean;
}

export interface ZyFullBook extends ZyBookBase {
    chapters: ZyChapter[];
    course: ZyFullCourse;
    disable_extensions: boolean;
    feature_flags: Record<string, boolean>;
    force_access_key: boolean;
    found_via_access_key_lookup: boolean;
    found_via_isbn_lookup: boolean;
    has_assignments: boolean;
    has_test_questions: boolean;
    hke: boolean;
    is_test: boolean;
    metadata: ZyBookMetadata;
    references_to_content_resources: {
        cr_map: object;
        inline_enums_lettering_map: object;
        reference_lettering_map: object;
        section_refs_map: Record<string, {
            chapter_number: number;
            guid: string;
            section_number: number;
        }>;
        sub_refs_map: object;
    };
    subscription: ZySubscription;
    subscription_info: ZySubscriptionInfo;
    summary: string;
    time_zone: unknown;
    unused: ZySection[];
    zybook_isbn: string;
}

export interface ZyBook extends ZyBookBase {
    /** ISO-formatted date */
    begin_date: string;
    course: ZyCourse;
    duration: unknown;
    /** ISO-formatted date */
    end_date: string;
    institution_id: number;
    institution_name: string;
    instructor_names: string[];
    price: number;
    /** ISO-formatted date */
    subscription_end_date: string;
    user_subscribed: boolean;
    user_zybook_role: string;
}