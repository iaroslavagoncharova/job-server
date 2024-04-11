const { getUsers } = require('../src/api/models/userModel');

describe('UserModel', () => {
    it('should return an array of users', async () => {
      const users = await getUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users).not.toBeNull();


      // email?: string | undefined;
      // fullname?: string | undefined;
      // username?: string | undefined;
      // field?: string | undefined;
      // phone?: string | undefined;
      // password?: string | undefined;
      // address?: string | undefined;
      // about_me?: string | undefined;
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
      }
    })
  });
