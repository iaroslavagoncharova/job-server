const {
  getSentApplicationsByUserId,
  acceptApplication,
} = require('../src/api/models/applicationModel');

describe('ApplicationModel', () => {
  it('should return an array of applications', async () => {
    const applications = await getSentApplicationsByUserId(1);
    expect(Array.isArray(applications)).toBe(true);
    if (applications) {
      applications.forEach((application) => {
        expect(application).toHaveProperty('application_id');
        expect(application).toHaveProperty('job_id');
        expect(application).toHaveProperty('user_id');
        expect(application).toHaveProperty('status');
        expect(application).toHaveProperty('created_at');
      });
    } else {
      expect(applications).toBe(null);
    }
  });
});

it('should return a message "Application accepted" when accepting an application', async () => {
  const result = await acceptApplication(1, 1);
  expect(result).toStrictEqual({ message: 'Application accepted' });
});
