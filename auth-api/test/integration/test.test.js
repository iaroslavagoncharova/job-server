const request = require('supertest');

const app = require('../../src/app').default;

describe('UserModel', () => {
  describe('GET /users', () => {
    it('should return an array of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  describe('POST /users', () => {
    it('should return an object of user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'example@example.com',
          password: 'password',
          fullname: 'Example User',
          phone: '1234567890',
          user_type: 'candidate',
        })
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.user).toHaveProperty('user_id');
      expect(response.body.user).toHaveProperty('user_id');
      expect(response.body.user).toHaveProperty('username');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('user_level_id');
      expect(response.body.user).toHaveProperty('fullname');
      expect(response.body.user).toHaveProperty('phone');
      expect(response.body.user).toHaveProperty('about_me');
      expect(response.body.user).toHaveProperty('status');
      expect(response.body.user).toHaveProperty('user_type');
      expect(response.body.user).toHaveProperty('link');
      expect(response.body.user).toHaveProperty('field');
      expect(response.body.user).toHaveProperty('created_at');
      expect(response.body.user).toHaveProperty('address');
    });
  });
});

describe('MatchModel', () => {
  describe('GET /matches', () => {
    it('should return an array of matches', async () => {
      const response = await request(app)
        .get('/api/v1/matches')
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

describe('JobModel', () => {
  describe('GET /jobs/id', () => {
    it('should return an object of job', async () => {
      const response = await request(app)
        .get('/api/v1/jobs/1')
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('job_id');
      expect(response.body).toHaveProperty('job_address');
      expect(response.body).toHaveProperty('job_title');
      expect(response.body).toHaveProperty('salary');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('job_description');
      expect(response.body).toHaveProperty('deadline_date');
      expect(response.body).toHaveProperty('field');
      expect(response.body).toHaveProperty('skills');
      expect(response.body).toHaveProperty('keywords');
    });
  });
});
