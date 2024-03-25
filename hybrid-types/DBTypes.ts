export type User = {
    user_id: number;
    username: string;
    password: string;
    email: string;
    user_level_id: number;
    fullname: string;
    phone: string;
    about_me: string;
    status: string;
    user_type: string;
    link: string;
    field: string;
    created_at: string;
};

export type UnauthorizedUser = Omit<User, 'password'>;

export type TokenUser = {
    user_id: number;
    user_level_id: number;
    user_type: string;
};

export type Chats = {
    chat_id: number;
    created_at: string;
};  

export type Message = {
    message_id: number;
    user_id: number;
    chat_id: number;
    message_text: string;
    sent_at: string;
};