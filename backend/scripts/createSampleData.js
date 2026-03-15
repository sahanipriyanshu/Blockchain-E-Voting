import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Election from '../models/Election.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

const createSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Create or update admin user
    const adminEmail = 'hvinprimary@gmail.com';
    const adminPassword = '123456';

    let admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created:', admin.email);
    } else {
      // Update password if user exists
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(adminPassword, salt);
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated:', admin.email);
    }

    // Create sample election for today (one day duration)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0); // Start of today
    
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999); // End of today

    // Check if election already exists
    const existingElection = await Election.findOne({ 
      title: 'Presidential Election 2024' 
    });

    if (existingElection) {
      // Update existing election
      existingElection.startDate = startDate;
      existingElection.endDate = endDate;
      existingElection.status = 'active';
      await existingElection.save();
      console.log('Election updated:', existingElection.title);
    } else {
      // Create new election
      const election = await Election.create({
        title: 'Presidential Election 2024',
        description: 'Sample presidential election for demonstration purposes. This election showcases the blockchain e-voting system with secure, transparent, and tamper-proof voting.',
        candidates: [
          {
            name: 'John Smith',
            party: 'Democratic Party',
            bio: 'Experienced politician with 15 years in public service. Focus on education reform and healthcare.',
            imageUrl: '',
          },
          {
            name: 'Sarah Johnson',
            party: 'Republican Party',
            bio: 'Business leader and advocate for economic growth. Strong supporter of free market principles.',
            imageUrl: '',
          },
          {
            name: 'Michael Chen',
            party: 'Independent',
            bio: 'Tech entrepreneur and environmental activist. Promotes innovation and sustainability.',
            imageUrl: '',
          },
          {
            name: 'Emily Rodriguez',
            party: 'Green Party',
            bio: 'Climate scientist and policy expert. Dedicated to environmental protection and renewable energy.',
            imageUrl: '',
          },
        ],
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        totalVotes: 0,
      });
      console.log('Election created:', election.title);
      console.log('Election ID:', election._id);
      console.log('Start Date:', startDate.toLocaleString());
      console.log('End Date:', endDate.toLocaleString());
      console.log('Candidates:', election.candidates.length);
    }

    console.log('\n✅ Sample data created successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nElection is active for today only!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

createSampleData();



