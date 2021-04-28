import { ZyContentType } from "./assignment";

export interface ZySection {
    canonical_chapter_number: number;
    canonical_section_id: number;
    canonical_section_number: number;
    custom_title: string | null;
    do_not_anchor: unknown;
    gdoc_id: string;
    guid: string;
    hidden: boolean;
    is_draft: number;
    is_timegated: number;
    metadata: unknown;
    new: boolean;
    number: number;
    optional: boolean;
    release_id: number;
    short_title: string;
    subject_id: number;
    subject_label: string;
    subject_name: string;
    summary: string;
    title: string;
    type: ZyContentType | null;
    zybooks_owned: boolean;
}

export interface ZyChapter {
    number: number;
    sections: ZySection[];
    title: string;
}