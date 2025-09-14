export type Events = Record<string, (e: Event) => void>;
export interface ComponentProps {
    label?: string;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    events?: Events;
    icon?: string;
    id?: string
}


export interface InputProps {
    label?: string;
    name?: string;
    id?: string;
    value?: string;
    accept?:string;
    inputType?: "text" | "date" | "email" | "password" | "file";
    className?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    disabled?: boolean;
    hasValidate?: boolean;
    events?: Events;
    errorMessage?: string;
}

export interface UserData {
    first_name: string,
    second_name: string,
    avatar: string,
    email: string,
    login: string,
    phone: string,
    display_name?: string,
    id?: number
}

export interface MessageData {
    time: TimeRanges,
    content: string,
    user: UserData,
    isOutgoing?: boolean
}

export interface ChatData {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    created_by: number,
    events?: Events;
    isSelected?: boolean;
    last_message: MessageData
}

export interface ChatsListState { 
    chats: ChatData[],
    loading: boolean,
    error: string | null,
    selectedChatId: number | null
}

export interface MainPageState {
  chatsList: ChatData[];
  messagesList: MessageData[];
  selectedChatId: number | null;
}

export interface MainPageProps {
  title: string;
}

export interface ChatItemProps {
    ChatData: ChatData, 
    onClick?: () => void,
    activeChatId: number
}

export interface ChatHeaderProps {
    chatTitle: string | null,
    onSelectSetting: (type:string) => void
    [key: string]: unknown;
}

export interface ChatUsersModalProps {
  chatId?: number | null;
  users?: Array<{ id: number; first_name: string; second_name: string; login: string }>;
  onClose?: () => void;
  onRemoveUser?: (chatId: number, userId: number) => void;
  [key: string]: unknown;
}

export interface ChatuserData {
    id: number,
    first_name: string,
    second_name: string,
    display_name: string,
    login: string,
    avatar: string,
    role: string
}


