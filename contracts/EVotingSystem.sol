// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VoterRegistration.sol";
import "./BallotContract.sol";
import "./TabulationContract.sol";
import "./AuditContract.sol";

/**
 * @title EVotingSystem
 * @dev Main contract that deploys and manages all voting system contracts
 */
contract EVotingSystem {
    VoterRegistrationContract public voterRegistration;
    BallotContract public ballotContract;
    TabulationContract public tabulationContract;
    AuditContract public auditContract;
    
    address public owner;
    
    event ContractsDeployed(
        address indexed voterRegistration,
        address indexed ballotContract,
        address indexed tabulationContract,
        address auditContract
    );
    
    constructor() {
        owner = msg.sender;
        
        voterRegistration = new VoterRegistrationContract();
        ballotContract = new BallotContract();
        tabulationContract = new TabulationContract();
        auditContract = new AuditContract();
        
        emit ContractsDeployed(
            address(voterRegistration),
            address(ballotContract),
            address(tabulationContract),
            address(auditContract)
        );
    }
    
    /**
     * @dev Get all contract addresses
     * @return voterReg The voter registration contract address
     * @return ballot The ballot contract address
     * @return tabulation The tabulation contract address
     * @return audit The audit contract address
     */
    function getContractAddresses() public view returns (
        address voterReg,
        address ballot,
        address tabulation,
        address audit
    ) {
        return (
            address(voterRegistration),
            address(ballotContract),
            address(tabulationContract),
            address(auditContract)
        );
    }
}



