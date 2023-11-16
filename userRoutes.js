const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createUser, getUsers, updateUser, deleteUser } = require("./userController");

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "asset", "img"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}.${file.originalname.split(".").pop()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File type is not supported. Only JPEG/PNG files are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter,
});

// Middleware for checking profile picture format and size
const checkProfilePicture = (req, res, next) => {
  upload.single("profilePicture")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File size exceeds the limit (5MB)" });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// CREATE - Add a new user
router.post("/", checkProfilePicture, createUser);

// READ - Get all users
router.get("/", getUsers);

// UPDATE - Update a user based on id
router.put("/:userId", updateUser);

// DELETE - Delete a user based on id
router.delete("/:userId", deleteUser);

module.exports = router;
