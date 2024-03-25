import {Pool, ResultSetHeader} from 'mysql2/promise';
import CustomError from '../../classes/CustomError';
import {EducationInfo, ExperienceInfo} from '@sharedTypes/DBTypes';
import {promisePool} from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// get education by user id
const getEducationByUser = async (id: number): Promise<EducationInfo[]> => {
  try {
    const [result] = await promisePool.execute<
      ResultSetHeader & EducationInfo[]
    >('SELECT * FROM Education WHERE user_id = ?', [id]);
    return result;
  } catch (error) {
    throw new CustomError('Failed to get education', 500);
  }
};

// add education
const addEducation = async (
  id: number,
  education: EducationInfo
): Promise<MessageResponse> => {
  try {
    console.log(id, education);
    const result = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Education (user_id, school, degree, field, graduation) VALUES (?, ?, ?, ?, ?)',
      [
        id,
        education.school,
        education.degree,
        education.field,
        education.graduation,
      ]
    );
    console.log(result);
    if (result[0].affectedRows === 0) {
      throw new CustomError('Failed to add education', 500);
    }
    return {message: 'Education added'};
  } catch (error) {
    throw new CustomError('Failed to add education', 500);
  }
};

// update education
const putEducation = async (
  education_id: number,
  user_id: number,
  education: EducationInfo
) => {
  const updateInfo: EducationInfo = {};
  if (education.school !== null) {
    updateInfo.school = education.school;
  }
  if (education.degree !== null) {
    updateInfo.degree = education.degree;
  }
  if (education.field !== null) {
    updateInfo.field = education.field;
  }
  if (education.graduation !== null) {
    updateInfo.graduation = education.graduation;
  }
  try {
    const sql = promisePool.format(
      'UPDATE Education SET ? WHERE education_id = ? AND user_id = ?',
      [updateInfo, education_id, user_id]
    );

    console.log(sql);

    const result = await promisePool.execute<ResultSetHeader>(sql);
    if (result[0].affectedRows === 0) {
      return null;
    }
    return {message: 'Education updated'};
  } catch (error) {
    throw new CustomError('Failed to update education', 500);
  }
};

// Delete education
const deleteEducation = async (
  user_id: number,
  education_id: number
): Promise<MessageResponse> => {
  try {
    const result = await promisePool.execute(
      'DELETE FROM Education WHERE education_id = ? AND user_id = ?',
      [education_id, user_id]
    );
    if (!result) {
      throw new CustomError('Failed to delete education', 500);
    }
    return {message: 'Education deleted'};
  } catch (error) {
    throw new CustomError('Failed to delete education', 500);
  }
};

const getExperience = async (id: number): Promise<ExperienceInfo[]> => {
  try {
    const [result] = await promisePool.execute<
      ResultSetHeader & ExperienceInfo[]
    >('SELECT * FROM JobExperience WHERE user_id = ?', [id]);
    console.log(result);
    return result;
  } catch (error) {
    throw new CustomError('Failed to get experience', 500);
  }
};

// // Add experience
// const postExperience = async (user_id: number, experience: ExperienceInfo): Promise<MessageResponse> => {
//   try {
//     console.log(user_id, experience);
//     const sql = promisePool.format(
//       'INSERT INTO JobExperience (user_id, job_title, job_place, job_city, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?);',
//       [
//         user_id,
//         experience.job_title,
//         experience.job_place,
//         experience.job_city,
//         experience.description,
//         experience.start_date,
//         experience.end_date,
//       ]
//     );
//     console.log(sql);
//     const result = await promisePool.execute<ResultSetHeader>(
//       'INSERT INTO JobExperience (user_id, job_title, job_place, job_city, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
//         [
//           user_id,
//           experience.job_title,
//           experience.job_place,
//           experience.job_city,
//           experience.description,
//           experience.start_date,
//           experience.end_date,
//       ]
//     );
//     if (result[0].affectedRows === 0) {
//       console.log('result', result);
//       throw new CustomError('Failed to add experience', 500);
//     }
//     return {message: 'Experience added'};
//   } catch (error) {
//     throw new CustomError('Failed to add experience', 500);
//   }
// };

  // Delete experience
  const deleteExperience = async (user_id: number, experience_id: number): Promise<MessageResponse> => {
    try {
      const result = await promisePool.execute(
        'DELETE FROM JobExperience WHERE experience_id = ? AND user_id = ?',
        [experience_id, user_id]
      );
      if (!result) {
        throw new CustomError('Failed to delete experience', 500);
      }
      return {message: 'Experience deleted'};
    } catch (error) {
      throw new CustomError('Failed to delete experience', 500);
    }
  };

export {
  addEducation,
  getEducationByUser,
  putEducation,
  deleteEducation,
  getExperience,
  deleteExperience,
};

//   // Update experience
//   async updateExperience(userId: number, experienceId: number, experienceInfo: ExperienceInfo): Promise<void> {
//     const { job_title, job_place, job_city, description, start_date, end_date } = experienceInfo;
//     try {
//       await promisePool.execute(
//         'UPDATE JobExperience SET job_title = ?, job_place = ?, job_city = ?, description = ?, start_date = ?, end_date = ? WHERE experience_id = ? AND user_id = ?',
//         [job_title, job_place, job_city, description, start_date, end_date, experienceId, userId]
//       );
//     } catch (error) {
//       throw new CustomError('Failed to update experience', 500);
//     }
//   }
// }
