const {promisePool} = require('./src/lib/db');

afterAll(async () => {
  await promisePool.end();
});
