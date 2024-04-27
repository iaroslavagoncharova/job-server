const {getUsers, postUser, putUser} = require('../src/api/models/userModel');

describe('UserModel', () => {
  it('should return an array of users', async () => {
    const users = await getUsers();
    expect(Array.isArray(users)).toBe(true);
    if (users) {
      users.forEach((user) => {
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
  });
});

it('should return an object of user', async () => {
  const user = await postUser({
    email: 'test@example.com',
    password: 'password',
    fullname: 'Test User',
    phone: '1234567890',
    user_type: 'candidate',
  });
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

it('should return an object of user', async () => {
  const user = await putUser(6, {
    email: 'test2@example.com',
    password: 'password',
    fullname: 'Test User',
    phone: '1234567890',
    user_type: 'candidate',
  });

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
