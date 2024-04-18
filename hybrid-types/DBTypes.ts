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
  username?: string | undefined;
  field?: string | undefined;
  phone?: string | undefined;
  password?: string | undefined;
  address?: string | undefined;
  about_me?: string | undefined;
};

export type UnauthorizedUser = Omit<User, "password">;

export type SkillName = {
  skill_name: string;
};

export type CandidateProfile = {
  user_id: number;
  username: string;
  about_me: string;
  link: string;
  field: string;
  skills: SkillName[];
  education: Education[];
  experience: Experience[];
  attachments: Attachment[];
};

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
  interview_status: string;
  created_at: Date | string;
};

export type Message = {
  message_id: number;
  user_id: number;
  chat_id: number;
  message_text: string;
  sent_at: Date | string;
};

export type PostMessage = {
  user_id: number;
  chat_id: number;
  message_text: string;
};

export type MessageWithUser = Message & Pick<User, "username">;

export type Match = {
  match_id: number;
  user1_id: number;
  user2_id: number;
  created_at: Date | string;
};

export type MatchWithUser = Match & {
  user: UnauthorizedUser;
};

export type Keyword = {
  keyword_id: number;
  keyword_name: string;
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
  attachment_name: string;
  filename: string;
  filesize: number;
  media_type: string;
  user_id: number;
};

export type UploadAttachment = {
  attachment_name: string;
  file: File;
};

export type AttachmentInfo = {
  attachment_name: string;
  filename: string;
  filesize: number;
  media_type: string;
};

export type UpdateAttachment = {
  attachment_name?: string | undefined;
  filename?: string;
  filesize?: number;
  media_type?: string;
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

export type JobWithUser = Job & {
  username: string;
};

export type UpdateJob = {
  job_address?: string | undefined;
  job_title?: string | undefined;
  salary?: string | undefined;
  job_description?: string | undefined;
  deadline_date?: Date | string | undefined;
  field?: string | undefined;
  skills?: string | undefined;
  keywords?: string | undefined;
};

export type Swipe = {
  swipe_id: number;
  swiper_id: number;
  swiped_id: number;
  swipe_direction: string;
  swipe_type: string;
  swiped_at: Date | string;
};

export type Notification = {
  notification_id: number;
  match_id: number;
  created_at: Date | string;
};

export type FileInfo = {
  filename: string;
  user_id: number;
};

export type Test = {
  test_id: number;
  test_type: string;
  user_id: number;
  test_link: string;
};