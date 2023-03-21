import * as hre from 'hardhat'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deployer, owner } = await getNamedAccounts()

  console.log('deployer', deployer)
  console.log('owner', owner)
  const signer = await hre.ethers.getSigner(owner)
  const registry = await hre.ethers.getContract('ENSRegistry', signer)
  const resolver = await hre.ethers.getContract('PublicResolver')
  console.log('registry', registry.address)
  console.log('resolver', resolver.address)

  const value = await registry.owner(ZERO_HASH)
  console.log(value)

  const node =
    '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'

  const ownerOfNode = await registry.owner(node)
  console.log('ownerOfNode', ownerOfNode)

  const resolverOfNode = await registry.resolver(node)
  console.log('resolverOfNode', resolverOfNode)

  const tx = await registry.connect(signer).setResolver(node, resolver.address)
  tx.wait()

  const resolverOfNode2 = await registry.resolver(node)
  console.log('resolverOfNode2', resolverOfNode2)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
