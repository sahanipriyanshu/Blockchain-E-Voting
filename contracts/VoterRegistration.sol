// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VoterRegistrationContract
 * @dev Manages voter registration for elections
 */
contract VoterRegistrationContract {
    mapping(string => mapping(address => bool)) private registeredVoters;
    
    event VoterRegistered(string indexed electionId, address indexed voterAddress);
    
    /**
     * @dev Register a voter for an election
     * @param electionId The ID of the election
     * @param voterAddress The anonymous address of the voter
     * @return registered Whether the registration was successful
     */
    function registerVoter(string memory electionId, address voterAddress) public returns (bool registered) {
        require(!registeredVoters[electionId][voterAddress], "Voter already registered");
        registeredVoters[electionId][voterAddress] = true;
        emit VoterRegistered(electionId, voterAddress);
        return true;
    }
    
    /**
     * @dev Check if a voter is registered for an election
     * @param electionId The ID of the election
     * @param voterAddress The anonymous address of the voter
     * @return registered Whether the voter is registered
     */
    function isRegistered(string memory electionId, address voterAddress) public view returns (bool registered) {
        return registeredVoters[electionId][voterAddress];
    }
}



