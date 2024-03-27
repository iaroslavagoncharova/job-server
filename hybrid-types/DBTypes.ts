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
  address: string;
};

export type UpdateUser = {
  email?: string | undefined;
  fullname?: string | undefined;
  phone?: string | undefined;
  password?: string | undefined;
  address?: string | undefined;
  about_me?: string | undefined;
};

export type UnauthorizedUser = Omit<User, "password">;

export type CandidateProfile = Omit<
  User,
  | "user_id"
  | "password"
  | "status"
  | "user_level_id"
  | "user_type"
  | "created_at"
  | "address"
>;

export type TokenUser = {
  user_id: number;
  user_level_id: number;
  user_type: string;
};

export type TokenContent = Pick<User, "user_id"> &
  Pick<UserLevel, "level_name">;

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
  user1_id: number;
  user2_id: number;
  created_at: Date | string;
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

export type Experience = {
  experience_id: number;
  user_id: number;
  job_title: string;
  job_place: string;
  job_city: string;
  description: string;
  start_date: Date | string;
  end_date: Date | string;
};
export type ExperienceInfo = Partial<
  Omit<Experience, "experience_id" | "user_id">
>;

export type Education = {
  education_id: number;
  user_id: number;
  school: string;
  degree: string;
  field: string;
  graduation: Date | string;
};

export type EducationInfo = Partial<
  Omit<Education, "education_id" | "user_id">
>;

export type Skill = {
  skill_id: number;
  skill_name: string;
  type: string;
};

export type UserSkill = {
  userskill_id: number;
  user_id: number;
  skill_id: number;
};

export type Attachment = {
  attachment_id: number;
  user_id: number;
  attachment_name: string;
  link: string;
};

export type UpdateAttachment = {
  attachment_name?: string | undefined;
  link?: string | undefined;
};

export type Job = {
  job_id: number;
  job_address: string;
  job_title: string;
  salary: string;
  user_id: number;
  job_description: string;
  deadline_date: Date | string;
  field: string;
};

export type JobWithSkillsAndKeywords = Job & {
  skills: string;
  keywords: string;
};
