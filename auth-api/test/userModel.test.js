const { getUsers } = require('../src/api/models/userModel');

describe('UserModel', () => {
    it('should return an array of users', async () => {
      console.log('test getUsers');
      const users = await getUsers();
      if (users) {
        console.log('users:', users);
      } else {
        console.log('error');
      }
      expect(Array.isArray(users)).toBe(true);
      if (users) {
        users.forEach(user => {
          expect(user).toHaveProperty('user_id');
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('user_level_id');
          expect(user).toHaveProperty('fullname');
          expect(user).toHaveProperty('phone');
          expect(user).toHaveProperty('about_me');
          expect(user).toHaveProperty('status');
          expect(user).toHaveProperty('user_type');
          expect(user).toHaveProperty('link');
          expect(user).toHaveProperty('field');
          expect(user).toHaveProperty('created_at');
          expect(user).toHaveProperty('address');
        });
      } else {
        expect(users).toBe(null);
      }
      console.log('test getUsers done');
    })
  });
