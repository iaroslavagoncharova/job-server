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

export interface EducationInfo {
    school: string;
    degree: string;
    field: string;
    graduation: Date;
  }
  
 export interface ExperienceInfo {
    job_title: string;
    job_place: string;
    job_city: string;
    description: string;
    start_date: Date;
    end_date: Date;
  }