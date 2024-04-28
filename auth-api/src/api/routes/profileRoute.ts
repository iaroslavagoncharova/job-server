import express from 'express';
import {
  addAttachment,
  addUserSkill,
  getAttachmentById,
  getEducation,
  getExperienceById,
  getSkills,
  getSkillsByUser,
  getSkillsByUserId,
  getUserAttachments,
  postEducation,
  postExperience,
  removeAttachment,
  removeEducation,
  removeExperience,
  removeUserSkill,
  updateAttachment,
  updateEducation,
  updateExperience,
  updateUserSkill,
} from '../controllers/profileController';
import {authenticate} from '../../middlewares';
import {body} from 'express-validator';

const profileRoute = express.Router();

// routes for education
profileRoute
  /**
   * @api {get} /profile/education Get education
   * @apiName GetEducation
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {Object[]} education List of education
   * @apiSuccess {String} education.school School
   * @apiSuccess {String} education.degree Degree
   * @apiSuccess {String} education.field Field
   * @apiSuccess {Date} education.graduation Graduation date
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "school": "University of Lagos",
   *   "degree": "BSc",
   *   "field": "Computer Science",
   *   "graduation": "2019-12-31"
   *  }
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No education found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get education"
   * }
   *
   */
  .get('/education', authenticate, getEducation);
profileRoute
  /**
   * @api {post} /profile/education Add education
   * @apiName PostEducation
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {String} school School
   * @apiParam {String} degree Degree
   * @apiParam {String} field Field
   * @apiParam {Date} graduation Graduation date
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 201 OK
   * {
   *  "message": "Education added"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to add education"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .post(
    '/education',
    body('school').isString().notEmpty().escape().trim(),
    body('degree').isString().notEmpty().escape().trim(),
    body('field').isString().notEmpty().escape().trim(),
    body('graduation').isString().notEmpty().escape().trim(),
    authenticate,
    postEducation
  );
profileRoute
  /**
   * @api {put} /profile/education/:education_id Update education
   * @apiName UpdateEducation
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {String} school School
   * @apiParam {String} degree Degree
   * @apiParam {String} field Field
   * @apiParam {Date} graduation Graduation date
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Education updated"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "Education not found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to update education"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 400 Bad Request
   * {
   *  "error": "No fields to update"
   * }
   */
  .put(
    '/education/:education_id',
    body('school').isString().optional().escape().trim(),
    body('degree').isString().optional().escape().trim(),
    body('field').isString().optional().escape().trim(),
    body('graduation').isString().optional().escape().trim(),
    authenticate,
    updateEducation
  );
profileRoute
  /**
   * @api {delete} /profile/education/:education_id Delete education
   * @apiName DeleteEducation
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Education deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to delete education"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .delete('/education/:education_id', authenticate, removeEducation);

// routes for experience
profileRoute
  /**
   * @api {get} /profile/experience/:experience_id Get experience
   * @apiName GetExperience
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {Object} experience Experience
   * @apiSuccess {String} experience.job_title Job title
   * @apiSuccess {String} experience.job_place Job place
   * @apiSuccess {String} experience.job_city Job city
   * @apiSuccess {String} experience.description Description
   * @apiSuccess {Date} experience.start_date Start date
   * @apiSuccess {Date} experience.end_date End date
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "job_title": "Software Developer",
   *  "job_place": "Google",
   *  "job_city": "Mountain View",
   *  "description": "Developing software",
   *  "start_date": "2019-12-31",
   *  "end_date": "2021-12-31"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No experience found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Getting experience failed"
   * }
   */
  .get('/experience', authenticate, getExperienceById);
profileRoute
  /**
   * @api {post} /profile/experience Add experience
   * @apiName PostExperience
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {String} job_title Job title
   * @apiParam {String} job_place Job place
   * @apiParam {String} job_city Job city
   * @apiParam {String} description Description
   * @apiParam {Date} start_date Start date
   * @apiParam {Date} end_date End date
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 201 OK
   * {
   *  "message": "Experience added"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Experience not added"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 400 Bad Request
   * {
   *  "error": "Missing required fields"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .post('/experience', authenticate, postExperience);
profileRoute
  .route('/experience/:experience_id')
  /**
   * @api {put} /profile/experience/:experience_id Update experience
   * @apiName UpdateExperience
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {String} job_title Job title
   * @apiParam {String} job_place Job place
   * @apiParam {String} job_city Job city
   * @apiParam {String} description Description
   * @apiParam {Date} start_date Start date
   * @apiParam {Date} end_date End date
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Experience updated"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 400 Bad Request
   * {
   *  "error": "No experience to update"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to update experience"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .put(authenticate, updateExperience)
  /**
   * @api {delete} /profile/experience/:experience_id Delete experience
   * @apiName DeleteExperience
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Experience deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to delete experience"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .delete(authenticate, removeExperience);

// routes for skills
profileRoute
  /**
   * @api {get} /profile/skills Get skills
   * @apiName GetSkills
   * @apiGroup Profile
   * @apiPermission all
   * @apiSuccess {Object[]} skills List of skills
   * @apiSuccess {Number} skills.skill_id Skill ID
   * @apiSuccess {String} skills.skill_name Skill name
   * @apiSuccess {String} skills.type Skill type
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "skill_id": 1,
   *   "skill_name": "JavaScript",
   *   "type": "Hard"
   *  },
   *  {
   *   "skill_id": 2,
   *   "skill_name": "Python",
   *   "type": "Hard"
   *  },
   *  {
   *   "skill_id": 3,
   *   "skill_name": "Communication",
   *   "type": "Soft"
   *  }
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No skills found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get skills"
   * }
   */
  .get('/skills', getSkills);
profileRoute
  /**
   * @api {get} /profile/skills/user Get skills by user (using token)
   * @apiName GetSkillsByUser
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {Object[]} skills List of skills
   * @apiSuccess {Number} skills.skill_id Skill ID
   * @apiSuccess {String} skills.skill_name Skill name
   * @apiSuccess {String} skills.type Skill type
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "skill_id": 1,
   *   "skill_name": "JavaScript",
   *   "type": "Hard"
   *  }
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No skills found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get skills"
   * }
   *
   */
  .get('/skills/user', authenticate, getSkillsByUser);
profileRoute
  /**
   * @api {get} /profile/skills/user/:user_id Get skills by user ID
   * @apiName GetSkillsByUserId
   * @apiGroup Profile
   * @apiPermission all
   * @apiDescription Get skills by user ID (without token, e.g. for candidate profile)
   * @apiSuccess {Object[]} skills List of skills
   * @apiSuccess {Number} skills.skill_id Skill ID
   * @apiSuccess {String} skills.skill_name Skill name
   * @apiSuccess {String} skills.type Skill type
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "skill_id": 1,
   *   "skill_name": "JavaScript",
   *   "type": "Hard"
   *  },
   *  {
   *   "skill_id": 2,
   *   "skill_name": "Python",
   *   "type": "Hard"
   *  }
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No skills found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get skills"
   * }
   *
   */
  .get('/skills/user/:user_id', getSkillsByUserId);
profileRoute
  /**
   * @api {post} /profile/skills/:skill_id Add user skill
   * @apiName AddUserSkill
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {Number} skill_id Skill ID
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 201 OK
   * {
   *  "message": "Skill added"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to add skill"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Skill not added or already exists"
   * }
   */
  .post('/skills/:skill_id', authenticate, addUserSkill);
profileRoute
  .route('/skills/:skill_id')
  /**
   * @api {put} /profile/skills/:skill_id Update user skill
   * @apiName UpdateUserSkill
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {Number} skill_id Skill ID
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Skill updated"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to update skill"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .put(authenticate, updateUserSkill)
  /**
   * @api {delete} /profile/skills/:skill_id Delete user skill
   * @apiName DeleteUserSkill
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {String} message Success message
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "Skill deleted"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to delete skill"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .delete(authenticate, removeUserSkill);

//routes for attachments
profileRoute
  /**
   * @api {get} /profile/attachments Get user attachments
   * @apiName GetUserAttachments
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {Object[]} attachments List of attachments
   * @apiSuccess {Number} attachments.attachment_id Attachment ID
   * @apiSuccess {String} attachments.attachment_name Attachment name
   * @apiSuccess {String} attachments.filename Filename
   * @apiSuccess {Number} attachments.filesize File size
   * @apiSuccess {String} attachments.media_type Media type
   * @apiSuccess {Number} attachments.user_id User ID
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "attachment_id": 1,
   *   "attachment_name": "Resume",
   *   "filename": "resume.pdf",
   *   "filesize": 1024,
   *   "media_type": "application/pdf",
   *   "user_id": 1
   *  }
   * ]
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No attachments found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get attachments"
   * }
   */
  .get('/attachments', authenticate, getUserAttachments);
profileRoute
  /**
   * @api {post} /profile/attachments Add attachment
   * @apiName AddAttachment
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiParam {String} attachment_name Attachment name
   * @apiParam {File} file File
   * @apiSuccess {String} message Success message
   * @apiSuccess {Object} attachment Attachment
   * @apiSuccess {Number} attachment.attachment_id Attachment ID
   * @apiSuccess {String} attachment.attachment_name Attachment name
   * @apiSuccess {String} attachment.filename Filename
   * @apiSuccess {Number} attachment.filesize File size
   * @apiSuccess {String} attachment.media_type Media type
   * @apiSuccess {Number} attachment.user_id User ID
   * @apiSuccessExample {json} Success
   * HTTP/1.1 201 OK
   * {
   *  "message": "Attachment added",
   *  "attachment": {
   *                 "attachment_id": 1,
   *                 "attachment_name": "Resume",
   *                 "filename": "resume.pdf",
   *                 "filesize": 1024,
   *                 "media_type": "application/pdf",
   *                 "user_id": 1
   *                }
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to add attachment"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Attachment not created"
   * }
   *
   */
  .post('/attachments', authenticate, addAttachment);
profileRoute
  /**
   * @api {get} /profile/attachments/:attachment_id Get attachment by ID
   * @apiName GetAttachmentById
   * @apiGroup Profile
   * @apiPermission authenticated user
   * @apiSuccess {Object} attachment Attachment
   * @apiSuccess {Number} attachment.attachment_id Attachment ID
   * @apiSuccess {String} attachment.attachment_name Attachment name
   * @apiSuccess {String} attachment.filename Filename
   * @apiSuccess {Number} attachment.filesize File size
   * @apiSuccess {String} attachment.media_type Media type
   * @apiSuccess {Number} attachment.user_id User ID
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "attachment_id": 1,
   *  "attachment_name": "Resume",
   *  "filename": "resume.pdf",
   *  "filesize": 1024,
   *  "media_type": "application/pdf",
   *  "user_id": 1
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "Attachment not found"
   * }
   * @apiErrorExample {json} Error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Failed to get attachment"
   * }
   */
  .get('/attachments/:attachment_id', authenticate, getAttachmentById);
profileRoute
/**
 * @api {put} /profile/attachments/:attachment_id Update attachment
 * @apiName UpdateAttachment
 * @apiGroup Profile
 * @apiPermission authenticated user
 * @apiParam {String} attachment_name Attachment name
 * @apiParam {String} preferred_filename Preferred filename
 * @apiParam {String} filename Filename
 * @apiParam {Number} filesize File size
 * @apiParam {String} media_type Media type
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "message": "Attachment updated"
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to update attachment"
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 400 Bad Request
 * {
 *  "error": "Nothing to update"
 * }
 *
 *
 */
.put('/attachments/:attachment_id', authenticate, updateAttachment);
profileRoute
/**
 * @api {delete} /profile/attachments/:attachment_id Delete attachment
 * @apiName DeleteAttachment
 * @apiGroup Profile
 * @apiPermission authenticated user
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "message": "Attachment deleted"
 * }
 * @apiErrorExample {json} Error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to delete attachment"
 * }
 */
.delete(
  '/attachments/:attachment_id',
  authenticate,
  removeAttachment
);

export default profileRoute;
