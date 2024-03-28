import { Job, JobWithSkillsAndKeywords, Message, Notification, Swipe, UnauthorizedUser } from "./DBTypes";
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

type JobResponse = MessageResponse & {
  job: JobWithSkillsAndKeywords;
};

type SwipeResponse = MessageResponse & {
  swipe: Swipe;
};

type NotificationResponse = MessageResponse & {
  notification: Notification[];
  user: UnauthorizedUser;
};
export type { MessageResponse, ErrorResponse, UserResponse, ChatResponse, LoginResponse, JobResponse, SwipeResponse, NotificationResponse };