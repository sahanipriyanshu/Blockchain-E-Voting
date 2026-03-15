// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AuditContract
 * @dev Provides audit functionality for election integrity verification
 */
contract AuditContract {
    struct AuditRecord {
        string electionId;
        uint256 chainBlockNumber;
        uint256 votesOnChain;
        uint256 votesInDB;
        bool isValid;
        uint256 timestamp;
    }
    
    mapping(string => AuditRecord) private audits;
    
    event ElectionAudited(string indexed electionId, bool isValid);
    
    /**
     * @dev Perform an audit of an election
     * @param electionId The ID of the election
     * @param votesOnChain The number of votes on the blockchain
     * @param votesInDB The number of votes in the database
     * @return isValid Whether the election is valid
     */
    function auditElection(
        string memory electionId,
        uint256 votesOnChain,
        uint256 votesInDB
    ) public returns (bool isValid) {
        bool valid = (votesOnChain == votesInDB);
        
        audits[electionId] = AuditRecord({
            electionId: electionId,
            chainBlockNumber: block.number,
            votesOnChain: votesOnChain,
            votesInDB: votesInDB,
            isValid: valid,
            timestamp: block.timestamp
        });
        
        emit ElectionAudited(electionId, valid);
        return valid;
    }
    
    /**
     * @dev Get audit record for an election
     * @param electionId The ID of the election
     * @return chainBlockNumber The block number when audited
     * @return votesOnChain The number of votes on chain
     * @return votesInDB The number of votes in DB
     * @return isValid Whether the election is valid
     * @return timestamp The timestamp of the audit
     */
    function getAuditRecord(string memory electionId) public view returns (
        uint256 chainBlockNumber,
        uint256 votesOnChain,
        uint256 votesInDB,
        bool isValid,
        uint256 timestamp
    ) {
        AuditRecord memory audit = audits[electionId];
        return (
            audit.chainBlockNumber,
            audit.votesOnChain,
            audit.votesInDB,
            audit.isValid,
            audit.timestamp
        );
    }
}



