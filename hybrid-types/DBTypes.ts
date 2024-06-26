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

export type ReportedUser = {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  about_me: string;
  status: string;
  link: string;
  field: string;
  address: string;
  user_type: string;
  report_reason: string;
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
  status?: string | undefined;
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

export type TokenUser = Pick<User, "user_id">;

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
  preferred_filename?: string | undefined;
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

export type ReportedJob = {
  job_id: number;
  job_address: string;
  job_title: string;
  salary: string;
  user_id: number;
  job_description: string;
  deadline_date: Date | string;
  field: string;
  report_reason: string;
};

export type JobWithSkillsAndKeywords = Job & {
  skills: string;
  keywords: string;
};

export type JobWithUser = Job & {
  username: string;
  userTestsCount: number | null;
  jobTestsCount: number | null;
  percentage: number | null;
};

export type JobWithSkillSKeywordsAndUser = JobWithSkillsAndKeywords & {
  userTestsCount: number;
  jobTestsCount: number;
  percentage: number;
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

export type JobSkill = {
  job_id: number;
  skill_id: number;
};

export type UserTest = {
  user_id: number;
  test_id: number;
};

export type JobTest = {
  job_id: number;
  test_id: number;
};

export type Report = {
  report_id: number;
  user_id: number;
  reported_item_type: string;
  reported_item_id: number;
  report_reason: string;
  reported_at: Date | string;
  is_resolved: string;
};

export type Field = {
  field_id: number;
  field_name: string;
};
