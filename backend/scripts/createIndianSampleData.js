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

// Indian names for voters
const indianNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
  'Anjali Gupta', 'Rahul Mehta', 'Kavita Joshi', 'Suresh Iyer', 'Divya Nair',
  'Arjun Desai', 'Meera Shah', 'Karan Malhotra', 'Pooja Agarwal', 'Rohan Kapoor',
  'Neha Verma', 'Aditya Rao', 'Shreya Menon', 'Vivek Chawla', 'Isha Banerjee',
  'Ravi Krishnan', 'Tanvi Agarwal', 'Nikhil Sood', 'Ananya Das', 'Siddharth Jain',
  'Riya Chatterjee', 'Kunal Bansal', 'Aishwarya Nair', 'Harsh Varma', 'Sanjana Pillai',
  'Yash Tiwari', 'Maya Reddy', 'Abhishek Dubey', 'Sakshi Khanna', 'Rishabh Goyal',
  'Aditi Sinha', 'Varun Mittal', 'Ishita Sharma', 'Kartik Bajaj', 'Swati Trivedi'
];

// Indian elections with candidates
const elections = [
  {
    title: 'Lok Sabha Election 2024 - Delhi Constituency',
    description: 'General Election for Lok Sabha Member of Parliament from Delhi Constituency. This election will determine the representative for the national parliament.',
    candidates: [
      { name: 'Dr. Arvind Kejriwal', party: 'Aam Aadmi Party (AAP)' },
      { name: 'Gautam Gambhir', party: 'Bharatiya Janata Party (BJP)' },
      { name: 'Kanhaiya Kumar', party: 'Indian National Congress (INC)' },
      { name: 'Yogendra Yadav', party: 'Swaraj India' }
    ],
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    status: 'ended'
  },
  {
    title: 'Maharashtra State Assembly Election 2024',
    description: 'State Legislative Assembly Election for Maharashtra. Voters will elect representatives to the state assembly.',
    candidates: [
      { name: 'Uddhav Thackeray', party: 'Shiv Sena (UBT)' },
      { name: 'Devendra Fadnavis', party: 'Bharatiya Janata Party (BJP)' },
      { name: 'Sharad Pawar', party: 'Nationalist Congress Party (NCP)' },
      { name: 'Ashok Chavan', party: 'Indian National Congress (INC)' }
    ],
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-31'),
    status: 'ended'
  },
  {
    title: 'Karnataka Gram Panchayat Election 2024',
    description: 'Local village council election in Karnataka. This election will select the village council members.',
    candidates: [
      { name: 'Siddaramaiah', party: 'Indian National Congress (INC)' },
      { name: 'B.S. Yediyurappa', party: 'Bharatiya Janata Party (BJP)' },
      { name: 'H.D. Kumaraswamy', party: 'Janata Dal (Secular)' },
      { name: 'D.K. Shivakumar', party: 'Indian National Congress (INC)' }
    ],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    status: 'ended'
  },
  {
    title: 'West Bengal Municipal Corporation Election 2024',
    description: 'Municipal Corporation Election for Kolkata and surrounding areas. This will elect city council members.',
    candidates: [
      { name: 'Mamata Banerjee', party: 'All India Trinamool Congress (AITC)' },
      { name: 'Dilip Ghosh', party: 'Bharatiya Janata Party (BJP)' },
      { name: 'Adhir Ranjan Chowdhury', party: 'Indian National Congress (INC)' },
      { name: 'Sitaram Yechury', party: 'Communist Party of India (Marxist)' }
    ],
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    status: 'ended'
  },
  {
    title: 'Gujarat Legislative Assembly Election 2024',
    description: 'State Assembly Election for Gujarat. Voters will elect their state representatives.',
    candidates: [
      { name: 'Bhupendra Patel', party: 'Bharatiya Janata Party (BJP)' },
      { name: 'Hardik Patel', party: 'Indian National Congress (INC)' },
      { name: 'Jignesh Mevani', party: 'Independent' },
      { name: 'Alpesh Thakor', party: 'Indian National Congress (INC)' }
    ],
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-31'),
    status: 'ended'
  }
];

// Vote distribution percentages for each election (to make results realistic)
const voteDistributions = [
  // Lok Sabha - Delhi
  [0.35, 0.30, 0.25, 0.10], // AAP, BJP, INC, Swaraj India
  // Maharashtra
  [0.28, 0.32, 0.25, 0.15], // Shiv Sena, BJP, NCP, INC
  // Karnataka
  [0.30, 0.28, 0.22, 0.20], // INC, BJP, JD(S), INC
  // West Bengal
  [0.40, 0.25, 0.20, 0.15], // AITC, BJP, INC, CPI(M)
  // Gujarat
  [0.45, 0.30, 0.15, 0.10]  // BJP, INC, Independent, INC
];

const createIndianSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing sample data...');
    await Vote.deleteMany({});
    await Election.deleteMany({});
    // Keep admin user, only delete voters
    await User.deleteMany({ role: 'voter' });
    console.log('✅ Existing data cleared');

    // Create voters with Indian names
    console.log('\n👥 Creating voters...');
    const voters = [];
    for (let i = 0; i < indianNames.length; i++) {
      const name = indianNames[i];
      const email = `voter${i + 1}@indianevoting.com`;
      
      // Check if user already exists
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: '123456', // Default password for all voters
          role: 'voter',
        });
      }
      voters.push(user);
      console.log(`  ✓ Created voter: ${name} (${email})`);
    }
    console.log(`✅ Created ${voters.length} voters`);

    // Create elections
    console.log('\n🗳️  Creating elections...');
    const createdElections = [];
    for (const electionData of elections) {
      const election = await Election.create(electionData);
      createdElections.push(election);
      console.log(`  ✓ Created election: ${election.title}`);
    }
    console.log(`✅ Created ${createdElections.length} elections`);

    // Create votes for each election
    console.log('\n📊 Creating votes...');
    const password = process.env.ENCRYPTION_KEY || 'default-encryption-key';
    const privateKey = process.env.SIGNATURE_KEY || 'default-signature-key';

    let totalVotes = 0;

    for (let electionIndex = 0; electionIndex < createdElections.length; electionIndex++) {
      const election = createdElections[electionIndex];
      const distribution = voteDistributions[electionIndex];
      const candidates = election.candidates;

      // Calculate number of votes per candidate based on distribution
      const votesPerCandidate = voters.map((_, idx) => {
        const random = Math.random();
        let cumulative = 0;
        for (let i = 0; i < distribution.length; i++) {
          cumulative += distribution[i];
          if (random <= cumulative) {
            return i;
          }
        }
        return distribution.length - 1;
      });

      // Create votes
      for (let voterIndex = 0; voterIndex < voters.length; voterIndex++) {
        const voter = voters[voterIndex];
        const candidateIndex = votesPerCandidate[voterIndex];
        const candidate = candidates[candidateIndex];

        // Generate anonymous address for this election
        const anonymousAddress = generateAnonymousAddress();
        if (!voter.anonymousAddresses) {
          voter.anonymousAddresses = new Map();
        }
        voter.anonymousAddresses.set(election._id.toString(), anonymousAddress);
        await voter.save();

        // Create ballot data
        const ballotData = {
          electionId: election._id.toString(),
          candidateId: candidateIndex.toString(),
          candidateName: candidate.name,
          timestamp: new Date(election.endDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).getTime(), // Random time during election period
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
          createdAt: new Date(ballotData.timestamp),
        });

        totalVotes++;
      }

      // Update election total votes
      election.totalVotes = voters.length;
      await election.save();

      console.log(`  ✓ Created ${voters.length} votes for: ${election.title}`);
    }

    console.log(`\n✅ Created ${totalVotes} total votes`);

    // Summary
    console.log('\n📈 SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Voters Created: ${voters.length}`);
    console.log(`🗳️  Elections Created: ${createdElections.length}`);
    console.log(`📊 Total Votes Cast: ${totalVotes}`);
    console.log('\n📋 Election Details:');
    for (const election of createdElections) {
      const votes = await Vote.find({ electionId: election._id });
      const voteCounts = {};
      votes.forEach(vote => {
        voteCounts[vote.candidateName] = (voteCounts[vote.candidateName] || 0) + 1;
      });
      console.log(`\n  ${election.title}:`);
      Object.entries(voteCounts).forEach(([candidate, count]) => {
        const percentage = ((count / votes.length) * 100).toFixed(1);
        console.log(`    ${candidate}: ${count} votes (${percentage}%)`);
      });
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Sample data created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: hvinprimary@gmail.com / 123456');
    console.log('   Voters: voter1@indianevoting.com / 123456 (voter1 to voter40)');
    console.log('\n💡 You can now login as admin and view all the results!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
};

createIndianSampleData();



