import { Pool } from 'mysql2/promise';
import CustomError from '../../classes/CustomError';
import { EducationInfo, ExperienceInfo } from '@sharedTypes/DBTypes';
import { promisePool } from '../../lib/db';

class ProfileModel {

  // Add education
  async addEducation(userId: number, educationInfo: EducationInfo): Promise<void> {
    const { school, degree, field, graduation } = educationInfo;
    try {
      await promisePool.execute(
        'INSERT INTO Education (user_id, school, degree, field, graduation) VALUES (?, ?, ?, ?, ?)',
        [userId, school, degree, field, graduation]
      );
    } catch (error) {
      throw new CustomError('Failed to add education', 500);
    }
  }

  // Update education
  async updateEducation(userId: number, educationId: number, educationInfo: EducationInfo): Promise<void> {
    const { school, degree, field, graduation } = educationInfo;
    try {
      await promisePool.execute(
        'UPDATE Education SET school = ?, degree = ?, field = ?, graduation = ? WHERE education_id = ? AND user_id = ?',
        [school, degree, field, graduation, educationId, userId]
      );
    } catch (error) {
      throw new CustomError('Failed to update education', 500);
    }
  }

  // Delete education
  async deleteEducation(userId: number, educationId: number): Promise<void> {
    try {
      await promisePool.execute(
        'DELETE FROM Education WHERE education_id = ? AND user_id = ?',
        [educationId, userId]
      );
    } catch (error) {
      throw new CustomError('Failed to delete education', 500);
    }
  }

  // Add experience
  async addExperience(userId: number, experienceInfo: ExperienceInfo): Promise<void> {
    const { job_title, job_place, job_city, description, start_date, end_date } = experienceInfo;
    try {
      await promisePool.execute(
        'INSERT INTO JobExperience (user_id, job_title, job_place, job_city, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, job_title, job_place, job_city, description, start_date, end_date]
      );
    } catch (error) {
      throw new CustomError('Failed to add experience', 500);
    }
  }

  // Update experience
  async updateExperience(userId: number, experienceId: number, experienceInfo: ExperienceInfo): Promise<void> {
    const { job_title, job_place, job_city, description, start_date, end_date } = experienceInfo;
    try {
      await promisePool.execute(
        'UPDATE JobExperience SET job_title = ?, job_place = ?, job_city = ?, description = ?, start_date = ?, end_date = ? WHERE experience_id = ? AND user_id = ?',
        [job_title, job_place, job_city, description, start_date, end_date, experienceId, userId]
      );
    } catch (error) {
      throw new CustomError('Failed to update experience', 500);
    }
  }

  // Delete experience
  async deleteExperience(userId: number, experienceId: number): Promise<void> {
    try {
      await promisePool.execute(
        'DELETE FROM JobExperience WHERE experience_id = ? AND user_id = ?',
        [experienceId, userId]
      );
    } catch (error) {
      throw new CustomError('Failed to delete experience', 500);
    }
  }
}

const profileModel = new ProfileModel();
export {profileModel};
