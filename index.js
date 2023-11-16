const express = require("express");
const app = express();
const userRoutes = require('./userRoutes');

app.use(express.json());
app.use('/users', userRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});