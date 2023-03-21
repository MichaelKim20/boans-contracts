import * as hre from 'hardhat'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deployer, owner } = await getNamedAccounts()

  console.log('deployer', deployer)
  console.log('owner', owner)
  const signer = await hre.ethers.getSigner(owner)
  const root = await hre.ethers.getContract('Root', signer)
  const tx1 = await root.setSubnodeOwner(hre.ethers.utils.id('eth'), owner)
  tx1.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
