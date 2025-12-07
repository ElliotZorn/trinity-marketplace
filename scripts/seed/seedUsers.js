const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const User = require('../../models/userModel'); 

const MONGO_URI = process.env.MONGO_URI;

  const filePath = process.argv[2] || 'data/users.json';
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const seedData = JSON.parse(jsonData);

const transformUser = async (user) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); 
  const generatedUsername = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}${randomNum}`;

  return {
    user_id: user.user_id,
    username: generatedUsername,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.admin ? 'admin' : 'user',       
    password: user.password, 
    created_at: new Date(user.created_at),    
    profile_photo: user.profile_photo,
    email_verified: user.email_verified,
  };
};

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await User.deleteMany({});
    console.log('Existing users deleted');

    const transformedData = await Promise.all(seedData.map(transformUser));

    await User.insertMany(transformedData);
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = seedUsers;