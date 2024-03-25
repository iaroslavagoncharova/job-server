import { Message, UnauthorizedUser } from "./DBTypes";
type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UserResponse = MessageResponse & {
  user: UnauthorizedUser;
};

type ChatResponse = MessageResponse & {
  media: Message | Message[];
};

type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UnauthorizedUser;
};

export type { MessageResponse, ErrorResponse, UserResponse, ChatResponse, LoginResponse };
