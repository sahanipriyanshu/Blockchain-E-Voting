import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

// Generate encryption key from password
const deriveKey = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
};

// Encrypt ballot data
export const encryptBallot = (ballotData, password) => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(ballotData), 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    tag: tag.toString('hex'),
    algorithm: ALGORITHM,
  };
};

// Decrypt ballot data
export const decryptBallot = (encryptedData, password) => {
  try {
    const key = deriveKey(password, Buffer.from(encryptedData.salt, 'hex'));
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    const encrypted = Buffer.from(encryptedData.encrypted, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

// Sign vote with HMAC-SHA256
export const signVote = (ballotData, privateKey) => {
  const voteString = JSON.stringify(ballotData);
  return crypto
    .createHmac('sha256', privateKey)
    .update(voteString)
    .digest('hex');
};

// Verify signature
export const verifySignature = (ballotData, signature, privateKey) => {
  const expectedSignature = signVote(ballotData, privateKey);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

// Generate anonymous address
export const generateAnonymousAddress = () => {
  return '0x' + crypto.randomBytes(20).toString('hex');
};

// Create vote hash
export const createVoteHash = (voteData) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(voteData))
    .digest('hex');
};

// Hash identity for decoupling
export const hashIdentity = (identity) => {
  return crypto.createHash('sha256').update(identity).digest('hex');
};



