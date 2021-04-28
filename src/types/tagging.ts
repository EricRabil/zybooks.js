export interface ZySubject {
    about_page_canonical_section_id: number | null;
    cover_color: string;
    display_name: string;
    header_icon: string;
    label: string;
    name: string;
    release_id: number;
    subject_id: number;
    title: string;
}

export interface ZyTerm {
    name: string;
    year: number;
    academic_term_id?: number;
}