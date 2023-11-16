const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./key/serviceAccountKey.json");

const app = express();
app.use(express.json());

// Firebase Admin Initialisation
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-test-709ef-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

// Reference to users collection
const db = admin.database();
const usersRef = db.ref("users");

// CREATE - Add a new user
app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    if (!firstName || !lastName || !username) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Cek keunikan username sebelum menambahkan pengguna
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUserRef = usersRef.push();
    await newUserRef.set({
      firstName: firstName,
      lastName: lastName,
      username: username,
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error });
  }
});


// READ - Get all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await usersRef.once("value");
    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error getting users", error: error });
  }
});

// UPDATE - Update an user base on id
app.put("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const newData = req.body;
    await usersRef.child(userId).update(newData);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error: error });
  }
});

// DELETE - Delete a user base on id
app.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await usersRef.child(userId).remove();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error: error });
  }
});

// Check username
async function checkUsernameExists(username) {
  try {
    const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
    return snapshot.exists();
  } catch (error) {
    throw error;
  }
}

// Jalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
