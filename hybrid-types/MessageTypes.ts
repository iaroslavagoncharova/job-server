import {
  Attachment,
  Job,
  JobWithSkillsAndKeywords,
  Message,
  Notification,
  Swipe,
  Test,
  UnauthorizedUser,
} from "./DBTypes";
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

export type MediaResponse = MessageResponse & {
  media: Attachment | Attachment[];
};

type TestResponse = MessageResponse & {
  test: Test;
};

export type {
  MessageResponse,
  ErrorResponse,
  UserResponse,
  ChatResponse,
  LoginResponse,
  JobResponse,
  SwipeResponse,
  NotificationResponse,
  TestResponse,
};
