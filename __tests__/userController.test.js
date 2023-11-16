const request = require('supertest');
const app = require('../index');
const userRoutes = require('./../userRoutes');

app.use(express.json());
app.use('/users', userRoutes);
const { createUser, updateUser, deleteUser, getUsers } = require('../userController');

describe('User Controller Tests', () => {
  // Test createUser function
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should return an error for missing fields', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          // Missing required fields
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Missing fields');
    });

    it('should return an error for existing username', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'johndoe123', // Existing username
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username already exists');
    });
  });

  // Test updateUser function
  describe('PUT /users/:userId', () => {
    it('should update an existing user', async () => {
      // Add a user to update (simulate existing user data in the database)
      // ...

      const res = await request(app)
        .put('/users/1') // Replace with the ID of the user you added
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User updated successfully');
    });

    it('should return an error for non-existent user', async () => {
      const res = await request(app)
        .put('/users/999') // Non-existent user ID
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  // Test deleteUser function
  describe('DELETE /users/:userId', () => {
    it('should delete an existing user', async () => {
      // Add a user to delete (simulate existing user data in the database)
      // ...

      const res = await request(app).delete('/users/1'); // Replace with the ID of the user you added
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return an error for non-existent user', async () => {
      const res = await request(app).delete('/users/999'); // Non-existent user ID
      expect(res.statusCode).toEqual(500); // Or 404 if you handle it differently in your code
      // Add expectations for the error response if needed
    });
  });

  // Test getUsers function
  describe('GET /users', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toEqual(200);
      // Add expectations for the response body if needed
    });

    // Add more tests for different scenarios related to getting users
  });
});
