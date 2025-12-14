/* eslint-disable no-console */
require("dotenv").config();
const hre = require("hardhat");

const ROUTER_BY_NETWORK = {
  sepolia: process.env.SEPOLIA_ROUTER,
  polygonMumbai: process.env.MUMBAI_ROUTER,
  avalancheFuji: process.env.FUJI_ROUTER,
};

const LINK_BY_NETWORK = {
  sepolia: process.env.SEPOLIA_LINK,
  polygonMumbai: process.env.MUMBAI_LINK,
  avalancheFuji: process.env.FUJI_LINK,
};

function getDeploymentParams(networkName) {
  const router = process.env.ROUTER_ADDRESS || ROUTER_BY_NETWORK[networkName];
  const link = process.env.LINK_TOKEN_ADDRESS || LINK_BY_NETWORK[networkName];

  if (!router || !link) {
    throw new Error(
      `Missing router or LINK token address for network "${networkName}". ` +
        `Set ROUTER_ADDRESS/LINK_TOKEN_ADDRESS or populate the *_ROUTER and *_LINK env vars.`,
    );
  }

  return { router, link };
}

async function main() {
  const { name: networkName } = hre.network;
  const { router, link } = getDeploymentParams(networkName);

  console.log(`\n🚀 Deploying YieldAggregator to ${networkName}`);
  console.log(`Router: ${router}`);
  console.log(`LINK token: ${link}`);

  const YieldAggregator = await hre.ethers.getContractFactory("YieldAggregator");
  const aggregator = await YieldAggregator.deploy(router, link);

  await aggregator.waitForDeployment();
  const address = await aggregator.getAddress();

  console.log(`\n✅ YieldAggregator deployed at: ${address}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
