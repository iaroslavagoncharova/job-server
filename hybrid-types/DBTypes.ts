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
    school?: string | null | undefined;
    degree?: string | null | undefined;
    field?: string | null | undefined;
    graduation?: Date | null | undefined;
  }

export type Education = {
    education_id: number;
    user_id: number;
    school: string;
    degree: string;
    field: string;
    graduation: string;
};

export type Experience = {
    experience_id: number;
    user_id: number;
    job_title: string;
    job_place: string;
    job_city: string;
    description: string;
    start_date: string;
    end_date: string;
};
  
 export interface ExperienceInfo {
    job_title?: string | null | undefined;
    job_place?: string | null | undefined;
    job_city?: string | null | undefined;
    description?: string | null | undefined;
    start_date?: Date | null | undefined;
    end_date?: Date | null | undefined;
  }