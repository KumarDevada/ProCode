const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()
const app = express();
const port = 4000; // Use the PORT provided by Vercel or default to 4000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Sequelize with the database connection information
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect:'sqlite',
    dialectOptions: {
        ssl: {
          require: true, // Require SSL
          rejectUnauthorized: false, // Reject unauthorized connections (validate server's SSL certificate)
          // Additional SSL options (optional)
          // For example, provide path to CA certificates if not using system default
          // ca: '/path/to/ca-certificates.pem'
        }
      },
    storage:'./database.sqlite',
    logging: false,

});

// Define a User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Define routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

app.post('/users', async (req, res) => {
  const { name, language, code } = req.body;

  try {
    const now = new Date();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = days[now.getDay()];
    const dateOfMonth = now.getDate();
    const monthOfYear = months[now.getMonth()];

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const currentTime = `${dayOfWeek} ${monthOfYear} ${dateOfMonth} ${now.getFullYear()} ${hours}:${minutes}:${seconds}`;

    const user = await User.create({ username: name, language, code, time: currentTime });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
