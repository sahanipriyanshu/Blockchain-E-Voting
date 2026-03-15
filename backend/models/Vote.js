import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    anonymousAddress: {
      type: String,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    encryptedVote: {
      encrypted: String,
      iv: String,
      salt: String,
      tag: String,
      algorithm: String,
    },
    digitalSignature: {
      type: String,
    },
    decryptedData: {
      type: mongoose.Schema.Types.Mixed,
      select: false,
    },
    blockHash: {
      type: String,
    },
    transactionHash: {
      type: String,
      unique: true,
      sparse: true,
    },
    voteHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index: one vote per user per election
// Since userId is required, we can use a simple unique index
voteSchema.index({ electionId: 1, userId: 1 }, { unique: true });

// Unique index: one vote per anonymous address per election
// Using sparse index to allow null values
voteSchema.index(
  { electionId: 1, anonymousAddress: 1 },
  {
    unique: true,
    sparse: true, // Only index documents where anonymousAddress exists
  }
);

export default mongoose.model('Vote', voteSchema);

