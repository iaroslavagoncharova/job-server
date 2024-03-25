export type UserLevel = {
    level_id: number;
    level_name: string;
};

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

export type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

export type Application = {
    application_id: number;
    user_id: number;
    job_id: number;
    status: string;
    application_text: string | null;
    created_at: Date | string;
};

export type ApplicationLink = {
    link_id: number;
    application_id: number;
    link: string;
};

export type Chat = {
    chat_id: number;
    created_at: Date | string;
};

export type UserChat = {
    user_id: number;
    chat_id: number;
};

export type Message = {
    message_id: number;
    user_id: number;
    chat_id: number;
    message_text: string;
    sent_at: Date | string;
};

export type Match = {
    match_id: number;
    user1_id: number;
    user2_id: number;
    created_at: Date | string;
};