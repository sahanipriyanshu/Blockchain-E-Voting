import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

const createTestVoter = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const voterEmail = 'voter@test.com';
    const voterPassword = '123456';

    let voter = await User.findOne({ email: voterEmail });
    
    if (!voter) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(voterPassword, salt);
      
      voter = await User.create({
        name: 'Test Voter',
        email: voterEmail,
        password: hashedPassword,
        role: 'voter',
      });
      console.log('Test voter created:', voter.email);
    } else {
      console.log('Test voter already exists:', voter.email);
    }

    console.log('\n✅ Test voter account ready!');
    console.log('Email:', voterEmail);
    console.log('Password:', voterPassword);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestVoter();



