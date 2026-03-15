import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    candidates: [
      {
        name: {
          type: String,
          required: true,
        },
        party: {
          type: String,
          default: 'Independent',
        },
        bio: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'ended'],
      default: 'upcoming',
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    blockchainHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Election', electionSchema);

