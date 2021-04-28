export interface ZyTextNode {
    text: string;
    attributes: Array<{ type: string }>;
}

export interface ZyMultipleChoiceOption {
    explanation: ZyTextNode[];
    correct: boolean;
    label: string;
}

export interface ZyMultipleChoiceQuestion {
    text: ZyTextNode[];
    choices: ZyMultipleChoiceOption[];
}