const admin = require("firebase-admin");
const serviceAccount = require("./key/serviceAccountKey.json");

// Firebase Admin Initialisation
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-test-709ef-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

// Reference to users collection
const db = admin.database();
const usersRef = db.ref("users");

async function createUser(req, res) {
  try {
    const { firstName, lastName, username } = req.body;
    const file = req.file;

    if (!firstName || !lastName || !username) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUserRef = usersRef.push();
    const user = {
      firstName: firstName,
      lastName: lastName,
      username: username,
    };

    if (file) {
      const imagePath = `/asset/img/${file.filename}`;
      user.profilePicture = imagePath;
    }

    await newUserRef.set(user);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error });
  }
}

async function getUsers(req, res) {
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
}

async function updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const newData = req.body;
  
      const userSnapshot = await usersRef.child(userId).once('value');
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await usersRef.child(userId).update(newData);
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user", error: error });
    }
  }
  

async function deleteUser(req, res) {
  try {
    const userId = req.params.userId;
    await usersRef.child(userId).remove();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error: error });
  }
}

async function checkUsernameExists(username) {
  try {
    const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
    return snapshot.exists();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
