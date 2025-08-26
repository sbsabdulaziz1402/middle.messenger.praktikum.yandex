type Events = Record<string, (e: Event) => void>;
export default interface ComponentProps {
    label?: string;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    events?: Events;
    icon?: string;
}


export default interface InputProps {
    label?: string;
    name?: string;
    id?: string;
    value?: string;
    inputType?: "text" | "date" | "email" | "password";
    className?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    disabled?: boolean;
    hasValidate?: boolean;
    events?: Events;
    errorMessage?: string;
}

