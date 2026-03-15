import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy EVotingSystem contract
  const EVotingSystem = await hre.ethers.getContractFactory("EVotingSystem");
  const evotingSystem = await EVotingSystem.deploy();
  await evotingSystem.waitForDeployment();

  const systemAddress = await evotingSystem.getAddress();
  console.log("EVotingSystem deployed to:", systemAddress);

  // Get contract addresses
  const [voterReg, ballot, tabulation, audit] = await evotingSystem.getContractAddresses();
  console.log("VoterRegistration deployed to:", voterReg);
  console.log("BallotContract deployed to:", ballot);
  console.log("TabulationContract deployed to:", tabulation);
  console.log("AuditContract deployed to:", audit);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();

  // Save addresses to file
  const addresses = {
    system: systemAddress,
    voterRegistration: voterReg,
    ballotContract: ballot,
    tabulationContract: tabulation,
    auditContract: audit,
    network: network.name,
    chainId: Number(network.chainId),
  };

  const addressesPath = path.join(__dirname, "..", "backend", "contract-addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Contract addresses saved to:", addressesPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



