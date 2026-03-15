// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TabulationContract
 * @dev Stores and retrieves election tabulation results
 */
contract TabulationContract {
    struct Results {
        string electionId;
        uint256 totalVotes;
        uint256 timestamp;
        bool finalized;
    }
    
    mapping(string => Results) private results;
    
    event ResultsTabulated(string indexed electionId, uint256 totalVotes);
    
    /**
     * @dev Store tabulation results for an election
     * @param electionId The ID of the election
     * @param totalVotes The total number of votes
     * @return success Whether the results were stored successfully
     */
    function tabulateVotes(string memory electionId, uint256 totalVotes) public returns (bool success) {
        results[electionId] = Results({
            electionId: electionId,
            totalVotes: totalVotes,
            timestamp: block.timestamp,
            finalized: true
        });
        
        emit ResultsTabulated(electionId, totalVotes);
        return true;
    }
    
    /**
     * @dev Get tabulation results for an election
     * @param electionId The ID of the election
     * @return totalVotes The total number of votes
     * @return timestamp The timestamp of tabulation
     * @return finalized Whether the results are finalized
     */
    function getResults(string memory electionId) public view returns (
        uint256 totalVotes,
        uint256 timestamp,
        bool finalized
    ) {
        Results memory result = results[electionId];
        return (result.totalVotes, result.timestamp, result.finalized);
    }
}



