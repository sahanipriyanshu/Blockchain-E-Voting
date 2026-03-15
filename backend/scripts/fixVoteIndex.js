import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vote from '../models/Vote.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

const fixVoteIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Drop existing indexes
    try {
      await Vote.collection.dropIndex('electionId_1_userId_1');
      console.log('Dropped electionId_1_userId_1 index');
    } catch (error) {
      console.log('Index electionId_1_userId_1 does not exist or already dropped');
    }

    try {
      await Vote.collection.dropIndex('electionId_1_anonymousAddress_1');
      console.log('Dropped electionId_1_anonymousAddress_1 index');
    } catch (error) {
      console.log('Index electionId_1_anonymousAddress_1 does not exist or already dropped');
    }

    // Delete any votes with null userId (orphaned votes)
    const deleteResult = await Vote.deleteMany({ userId: null });
    console.log(`Deleted ${deleteResult.deletedCount} votes with null userId`);

    // Recreate indexes with partial filter
    await Vote.collection.createIndex(
      { electionId: 1, userId: 1 },
      {
        unique: true,
        partialFilterExpression: { userId: { $exists: true } },
        name: 'electionId_1_userId_1',
      }
    );
    console.log('Created electionId_1_userId_1 index with partial filter');

    await Vote.collection.createIndex(
      { electionId: 1, anonymousAddress: 1 },
      {
        unique: true,
        partialFilterExpression: { anonymousAddress: { $exists: true } },
        name: 'electionId_1_anonymousAddress_1',
      }
    );
    console.log('Created electionId_1_anonymousAddress_1 index with partial filter');

    console.log('\n✅ Vote indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
};

fixVoteIndex();

