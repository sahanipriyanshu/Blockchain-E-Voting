// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BallotContract
 * @dev Manages vote casting and prevents double voting
 */
contract BallotContract {
    struct Vote {
        string electionId;
        address anonymousAddress;
        string encryptedVote;
        bytes32 digitalSignature;
        uint256 timestamp;
    }
    
    mapping(string => mapping(address => bool)) private hasVoted;
    mapping(string => Vote[]) private votes;
    mapping(bytes32 => bool) private transactionHashes;
    
    event VoteCast(
        string indexed electionId,
        address indexed anonymousAddress,
        bytes32 indexed transactionHash
    );
    
    /**
     * @dev Cast a vote in an election
     * @param electionId The ID of the election
     * @param anonymousAddress The anonymous address of the voter
     * @param encryptedVote The encrypted vote data
     * @param digitalSignature The digital signature of the vote
     * @return voted Whether the vote was cast successfully
     * @return txHash The transaction hash
     */
    function castVote(
        string memory electionId,
        address anonymousAddress,
        string memory encryptedVote,
        bytes32 digitalSignature
    ) public returns (bool voted, bytes32 txHash) {
        require(!hasVoted[electionId][anonymousAddress], "Double voting detected");
        
        bytes32 txHashValue = keccak256(abi.encodePacked(
            electionId,
            anonymousAddress,
            encryptedVote,
            digitalSignature,
            block.timestamp
        ));
        
        require(!transactionHashes[txHashValue], "Duplicate transaction");
        transactionHashes[txHashValue] = true;
        
        votes[electionId].push(Vote({
            electionId: electionId,
            anonymousAddress: anonymousAddress,
            encryptedVote: encryptedVote,
            digitalSignature: digitalSignature,
            timestamp: block.timestamp
        }));
        
        hasVoted[electionId][anonymousAddress] = true;
        
        emit VoteCast(electionId, anonymousAddress, txHashValue);
        
        return (true, txHashValue);
    }
    
    /**
     * @dev Check if a voter has voted in an election
     * @param electionId The ID of the election
     * @param anonymousAddress The anonymous address of the voter
     * @return voted Whether the voter has voted
     */
    function hasVotedInElection(string memory electionId, address anonymousAddress) public view returns (bool voted) {
        return hasVoted[electionId][anonymousAddress];
    }
    
    /**
     * @dev Get vote count for an election
     * @param electionId The ID of the election
     * @return count The number of votes
     */
    function getVoteCount(string memory electionId) public view returns (uint256 count) {
        return votes[electionId].length;
    }
}



