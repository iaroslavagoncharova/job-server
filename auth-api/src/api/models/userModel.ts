import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {
  Attachment,
  CandidateProfile,
  Education,
  Experience,
  SkillName,
  UnauthorizedUser,
  UpdateUser,
  User,
} from '../../../../hybrid-types/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getUsers = async (): Promise<UnauthorizedUser[] | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >(
      'SELECT user_id, username, email, user_level_id, fullname, phone, about_me, status, user_type, link, field, created_at, address FROM Users'
    );
    if (result.length === 0) {
      return null;
    }
    if (!result) {
      throw new Error('Users not found');
    }
    return result;
  } catch (e) {
    console.log(e, 'error');
    throw new Error((e as Error).message);
  }
};

const getUser = async (id: number): Promise<UnauthorizedUser | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >('SELECT * FROM Users WHERE user_id = ?', [id]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUserAsCandidate = async (
  id: number
): Promise<CandidateProfile | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & CandidateProfile[]
    >(
      'SELECT Users.username, Users.email, Users.fullname, Users.phone, Users.about_me, Users.link, Users.field FROM Users WHERE user_id = ?',
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getAllCandidates = async (
  user_id: number
): Promise<CandidateProfile[] | null> => {
  try {
    // get basic user info
    const [userResult] = await promisePool.execute<
      RowDataPacket[] & CandidateProfile[]
    >(
      "SELECT Users.user_id, Users.username, Users.about_me, Users.link, Users.field FROM Users WHERE Users.user_id NOT IN (SELECT Swipes.swiped_id from Swipes WHERE Swipes.swiper_id = ? AND Swipes.swipe_type = 'candidate') AND Users.user_type = 'candidate'",
      [user_id]
    );
    if (userResult.length === 0) {
      return null;
    }

    const candidates = await Promise.all(
      userResult.map(async (user) => {
        // get user skills
        const [skillsResult] = await promisePool.execute<
          RowDataPacket[] & SkillName[]
        >(
          'SELECT Skills.skill_name FROM UserSkills JOIN Skills ON UserSkills.skill_id = Skills.skill_id WHERE user_id = ?',
          [user.user_id]
        );

        const skills: SkillName[] = skillsResult.map(
          (skill) => skill.skill_name
        );

        // get user education
        const [eduResult] = await promisePool.execute<
          RowDataPacket[] & Education[]
        >(
          'SELECT Education.degree, Education.school, Education.field, Education.graduation FROM Education WHERE user_id = ?',
          [user.user_id]
        );

        // get user experience
        const [expResult] = await promisePool.execute<
          RowDataPacket[] & Experience[]
        >(
          'SELECT JobExperience.job_title, JobExperience.job_place, JobExperience.job_city, JobExperience.description, JobExperience.start_date, JobExperience.end_date FROM JobExperience WHERE user_id = ?',
          [user.user_id]
        );

        // get user attachments
        const [attachResult] = await promisePool.execute<
          RowDataPacket[] & Attachment[]
        >('SELECT * FROM Attachments WHERE user_id = ?', [user.user_id]);

        return {
          user_id: user.user_id,
          username: user.username,
          about_me: user.about_me,
          link: user.link,
          field: user.field,
          skills: skills,
          education: eduResult,
          experience: expResult,
          attachments: attachResult,
        };
      })
    );
    console.log(candidates);
    const response = candidates.map((candidate) => {
      return candidate;
    });
    console.log(response);
    return response;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getOneCandidate = async (
  user_id: number
): Promise<CandidateProfile | null> => {
  try {
    // get basic user info
    const [userResult] = await promisePool.execute<
      RowDataPacket[] & CandidateProfile[]
    >(
      'SELECT Users.username, Users.about_me, Users.link, Users.field FROM Users WHERE Users.user_id = ?',
      [user_id]
    );
    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];

    // get user skills
    const [skillsResult] = await promisePool.execute<
      RowDataPacket[] & SkillName[]
    >(
      'SELECT Skills.skill_name FROM UserSkills JOIN Skills ON UserSkills.skill_id = Skills.skill_id WHERE user_id = ?',
      [user_id]
    );

    const skills: SkillName[] = skillsResult.map((skill) => skill.skill_name);

    // get user education
    const [eduResult] = await promisePool.execute<
      RowDataPacket[] & Education[]
    >(
      'SELECT Education.degree, Education.school, Education.field, Education.graduation FROM Education WHERE user_id = ?',
      [user_id]
    );

    // get user experience
    const [expResult] = await promisePool.execute<
      RowDataPacket[] & Experience[]
    >(
      'SELECT JobExperience.job_title, JobExperience.job_place, JobExperience.job_city, JobExperience.description, JobExperience.start_date, JobExperience.end_date FROM JobExperience WHERE user_id = ?',
      [user_id]
    );

    // get user attachments
    const [attachResult] = await promisePool.execute<
      RowDataPacket[] & Attachment[]
    >('SELECT * FROM Attachments WHERE user_id = ?', [user_id]);

    return {
      user_id: user_id,
      username: user.username,
      about_me: user.about_me,
      link: user.link,
      field: user.field,
      skills: skills,
      education: eduResult,
      experience: expResult,
      attachments: attachResult,
    };
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & User[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postUser = async (
  user: Pick<
    User,
    | 'username'
    | 'password'
    | 'email'
    | 'fullname'
    | 'phone'
    | 'user_type'
    | 'address'
    | 'user_level_id'
  >
): Promise<UnauthorizedUser | null> => {
  try {
    if (user.user_type === 'candidate') {
      // for a username, get a random value from animals and adjectives tables
      const [usernameResult] = await promisePool.execute<RowDataPacket[]>(
        'SELECT animal_name FROM Animals ORDER BY RAND() LIMIT 1'
      );
      const [adjectiveResult] = await promisePool.execute<RowDataPacket[]>(
        'SELECT adj_name FROM Adjectives ORDER BY RAND() LIMIT 1'
      );

      const username =
        adjectiveResult[0].adj_name + '_' + usernameResult[0].animal_name;

      const checkifUsernameExists = await promisePool.execute<RowDataPacket[]>(
        'SELECT * FROM Users WHERE username = ?',
        [username]
      );

      // if username already exists, generate a new one
      if (checkifUsernameExists[0].length > 0) {
        const [newUsernameResult] = await promisePool.execute<RowDataPacket[]>(
          'SELECT animal_name FROM Animals ORDER BY RAND() LIMIT 1'
        );
        const [newAdjectiveResult] = await promisePool.execute<RowDataPacket[]>(
          'SELECT adj_name FROM Adjectives ORDER BY RAND() LIMIT 1'
        );

        const newUsername =
          newAdjectiveResult[0].adj_name +
          '_' +
          newUsernameResult[0].animal_name;

        const checkifNewUsernameExists = await promisePool.execute<
          RowDataPacket[]
        >('SELECT * FROM Users WHERE username = ?', [newUsername]);

        if (checkifNewUsernameExists[0].length > 0) {
          throw new Error('Username generation failed');
        }
        user.username = newUsername;
        user.user_level_id = 1;
      }
    } else {
      user.user_level_id = 2;
    }
    const result = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Users (username, password, email, user_level_id, fullname, phone, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user.username,
        user.password,
        user.email,
        user.user_level_id,
        user.fullname,
        user.phone,
        user.address,
        user.user_type,
      ]
    );
    const createdUser = await getUser(result[0].insertId);
    return createdUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const putUser = async (
  id: number,
  user: UpdateUser
): Promise<UnauthorizedUser | null> => {
  try {
    const updateInfo: UpdateUser = {};
    if (user.email !== undefined) {
      updateInfo.email = user.email;
    }
    if (user.fullname !== undefined) {
      updateInfo.fullname = user.fullname;
    }
    if (user.phone !== undefined) {
      updateInfo.phone = user.phone;
    }
    if (user.password !== undefined) {
      updateInfo.password = user.password;
    }
    if (user.address !== undefined) {
      updateInfo.address = user.address;
    }
    if (user.about_me !== undefined) {
      updateInfo.about_me = user.about_me;
    }
    if (user.username !== undefined) {
      updateInfo.username = user.username;
    }
    if (user.field !== undefined) {
      updateInfo.field = user.field;
    }
    const sql = promisePool.format('UPDATE Users SET ? WHERE user_id = ?', [
      updateInfo,
      id,
    ]);
    const result = await promisePool.execute<ResultSetHeader>(sql);
    if (result[0].affectedRows === 0) {
      return null;
    }
    const updatedUser = await getUser(id);
    return updatedUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteUser = async (id: number): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM JobExperience WHERE user_id = ?', [
      id,
    ]);
    await connection.execute('DELETE FROM Education WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM Attachments WHERE user_id = ?', [id]);
    // delete from JobSkills that have job id that has user id
    await connection.execute(
      'DELETE FROM JobSkills WHERE job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?)',
      [id]
    );
    // delete from keywordsjobs that have job id that has user id
    await connection.execute(
      'DELETE FROM KeywordsJobs WHERE job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?)',
      [id]
    );
    // delete from applications that have job id that has user id
    await connection.execute(
      'DELETE FROM Applications WHERE job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?)',
      [id]
    );
    // delete from job tests that have job id that has user id
    await connection.execute(
      'DELETE FROM JobTests WHERE job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?)',
      [id]
    );
    await connection.execute('DELETE FROM JobAds WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM UserSkills WHERE user_id = ?', [id]);
    // delete application links that have application id that has user id
    await connection.execute(
      'DELETE FROM ApplicationLinks WHERE application_id IN (SELECT application_id FROM Applications WHERE user_id = ?)',
      [id]
    );
    await connection.execute('DELETE FROM Applications WHERE user_id = ?', [
      id,
    ]);
    await connection.execute('DELETE FROM Tests WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM UserTests WHERE user_id = ?', [id]);
    // delete messages that have user id and are from the chats that have user id
    await connection.execute(
      'DELETE FROM Messages WHERE chat_id IN (SELECT chat_id FROM Chats WHERE user1_id = ? OR user2_id = ?)',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Chats WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Swipes WHERE swiped_id = ? OR swiper_id = ?',
      [id, id]
    );
    //delete from notifications that are from the matches that have user id
    await connection.execute(
      'DELETE FROM Notifications WHERE match_id IN (SELECT match_id FROM Matches WHERE user1_id = ? OR user2_id = ?)',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Matches WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    await connection.execute('DELETE FROM Reports WHERE user_id = ?', [id]);
    // delete job ads with user id
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('User not deleted');
    }
    await connection.commit();
    return {message: 'User deleted'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {
  getUsers,
  getUser,
  getUserAsCandidate,
  getAllCandidates,
  getOneCandidate,
  postUser,
  getUserByEmail,
  deleteUser,
  putUser,
};
