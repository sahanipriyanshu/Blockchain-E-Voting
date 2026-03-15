import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
import {
  encryptBallot,
  signVote,
  generateAnonymousAddress,
  createVoteHash,
} from '../utils/encryption.js';
import crypto from 'crypto';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

const addActiveElection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Create active election (started 2 days ago, ends in 5 days)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 2); // Started 2 days ago
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 5); // Ends in 5 days

    const activeElection = {
      title: 'Tamil Nadu State Assembly Election 2024',
      description: 'State Legislative Assembly Election for Tamil Nadu. This election is currently active and accepting votes. Voters can cast their votes until the end date.',
      candidates: [
        { name: 'M.K. Stalin', party: 'Dravida Munnetra Kazhagam (DMK)' },
        { name: 'Edappadi K. Palaniswami', party: 'All India Anna Dravida Munnetra Kazhagam (AIADMK)' },
        { name: 'K. Annamalai', party: 'Bharatiya Janata Party (BJP)' },
        { name: 'Seeman', party: 'Naam Tamilar Katchi (NTK)' }
      ],
      startDate,
      endDate,
      status: 'active'
    };

    // Check if election already exists
    let election = await Election.findOne({ title: activeElection.title });
    if (election) {
      console.log('⚠️  Election already exists, updating...');
      election = await Election.findByIdAndUpdate(election._id, activeElection, { new: true });
    } else {
      election = await Election.create(activeElection);
    }
    console.log(`✅ Created/Updated active election: ${election.title}`);
    console.log(`   Start Date: ${startDate.toLocaleDateString()}`);
    console.log(`   End Date: ${endDate.toLocaleDateString()}`);
    console.log(`   Status: ${election.status}`);

    // Get existing voters
    const voters = await User.find({ role: 'voter' }).limit(25); // Use first 25 voters
    
    if (voters.length === 0) {
      console.log('⚠️  No voters found. Please run createIndianSampleData.js first.');
      process.exit(0);
    }

    // Create some votes for this active election (not all voters have voted yet)
    console.log('\n📊 Creating votes for active election...');
    const password = process.env.ENCRYPTION_KEY || 'default-encryption-key';
    const privateKey = process.env.SIGNATURE_KEY || 'default-signature-key';

    // Vote distribution: DMK 40%, AIADMK 30%, BJP 20%, NTK 10%
    const distribution = [0.40, 0.30, 0.20, 0.10];
    const candidates = election.candidates;

    // Only 20 out of 25 voters have voted (5 haven't voted yet - showing it's active)
    const votersToVote = voters.slice(0, 20);
    let voteCount = 0;

    for (const voter of votersToVote) {
      // Check if already voted
      const existingVote = await Vote.findOne({ 
        electionId: election._id, 
        userId: voter._id 
      });

      if (existingVote) {
        console.log(`  ⏭️  ${voter.name} already voted, skipping...`);
        continue;
      }

      // Randomly assign candidate based on distribution
      const random = Math.random();
      let cumulative = 0;
      let candidateIndex = 0;
      for (let i = 0; i < distribution.length; i++) {
        cumulative += distribution[i];
        if (random <= cumulative) {
          candidateIndex = i;
          break;
        }
      }

      const candidate = candidates[candidateIndex];

      // Generate anonymous address for this election
      const anonymousAddress = generateAnonymousAddress();
      if (!voter.anonymousAddresses) {
        voter.anonymousAddresses = new Map();
      }
      voter.anonymousAddresses.set(election._id.toString(), anonymousAddress);
      await voter.save();

      // Create ballot data (vote was cast sometime during the active period)
      const voteTime = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));
      const ballotData = {
        electionId: election._id.toString(),
        candidateId: candidateIndex.toString(),
        candidateName: candidate.name,
        timestamp: voteTime.getTime(),
      };

      // Encrypt ballot
      const encryptedVote = encryptBallot(ballotData, password);

      // Sign vote
      const digitalSignature = signVote(ballotData, privateKey);

      // Create vote hash
      const voteHash = createVoteHash(ballotData);

      // Generate transaction hash
      const transactionHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ ...ballotData, anonymousAddress, timestamp: Date.now() }))
        .digest('hex');

      // Create vote
      await Vote.create({
        electionId: election._id,
        userId: voter._id,
        anonymousAddress,
        candidateId: candidateIndex.toString(),
        candidateName: candidate.name,
        encryptedVote,
        digitalSignature,
        voteHash,
        transactionHash,
        createdAt: voteTime,
      });

      voteCount++;
      console.log(`  ✓ ${voter.name} voted for ${candidate.name}`);
    }

    // Update election total votes
    election.totalVotes = voteCount;
    await election.save();

    // Summary
    console.log(`\n✅ Created ${voteCount} votes for active election`);
    
    // Show vote distribution
    const votes = await Vote.find({ electionId: election._id });
    const voteCounts = {};
    votes.forEach(vote => {
      voteCounts[vote.candidateName] = (voteCounts[vote.candidateName] || 0) + 1;
    });

    console.log('\n📈 Current Vote Distribution:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(voteCounts).forEach(([candidate, count]) => {
      const percentage = ((count / votes.length) * 100).toFixed(1);
      console.log(`  ${candidate}: ${count} votes (${percentage}%)`);
    });
    console.log(`\n  Total Votes: ${votes.length}`);
    console.log(`  Remaining Voters: ${voters.length - votes.length} (election still active)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n✅ Active election created successfully!');
    console.log('\n💡 This election is currently ACTIVE and accepting votes!');
    console.log('   You can login as a voter and cast votes for this election.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating active election:', error);
    process.exit(1);
  }
};

addActiveElection();



