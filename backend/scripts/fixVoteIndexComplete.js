import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vote from '../models/Vote.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

const fixVoteIndexComplete = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Get all indexes
    const indexes = await Vote.collection.getIndexes();
    console.log('\nCurrent indexes:', JSON.stringify(indexes, null, 2));

    // Drop ALL indexes except _id
    const indexNames = Object.keys(indexes).filter(name => name !== '_id_');
    for (const indexName of indexNames) {
      try {
        await Vote.collection.dropIndex(indexName);
        console.log(`✓ Dropped index: ${indexName}`);
      } catch (error) {
        console.log(`✗ Could not drop ${indexName}:`, error.message);
      }
    }

    // Delete any votes with null or missing userId
    const deleteResult = await Vote.deleteMany({
      $or: [
        { userId: null },
        { userId: { $exists: false } },
        { voterId: { $exists: true } } // Delete any with old voterId field
      ]
    });
    console.log(`\n✓ Deleted ${deleteResult.deletedCount} invalid votes`);

    // Ensure userId is always set for existing votes (migration)
    const updateResult = await Vote.updateMany(
      { userId: { $exists: false } },
      { $unset: { voterId: "" } } // Remove old voterId if exists
    );
    console.log(`✓ Updated ${updateResult.modifiedCount} votes`);

    // Recreate indexes with correct configuration
    console.log('\nCreating new indexes...');
    
    // Index 1: electionId + userId (unique, required field)
    await Vote.collection.createIndex(
      { electionId: 1, userId: 1 },
      {
        unique: true,
        name: 'electionId_1_userId_1',
      }
    );
    console.log('✓ Created electionId_1_userId_1 index');

    // Index 2: electionId + anonymousAddress (unique, sparse)
    await Vote.collection.createIndex(
      { electionId: 1, anonymousAddress: 1 },
      {
        unique: true,
        sparse: true, // Only index documents where anonymousAddress exists
        name: 'electionId_1_anonymousAddress_1',
      }
    );
    console.log('✓ Created electionId_1_anonymousAddress_1 index (sparse)');

    // Index 3: Single field indexes
    await Vote.collection.createIndex({ electionId: 1 });
    console.log('✓ Created electionId index');
    
    await Vote.collection.createIndex({ userId: 1 });
    console.log('✓ Created userId index');
    
    await Vote.collection.createIndex({ anonymousAddress: 1 });
    console.log('✓ Created anonymousAddress index');

    // Verify indexes
    const newIndexes = await Vote.collection.getIndexes();
    console.log('\n✓ New indexes:', Object.keys(newIndexes));

    console.log('\n✅ All vote indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
};

fixVoteIndexComplete();

