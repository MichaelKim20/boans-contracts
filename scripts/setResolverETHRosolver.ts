import * as hre from 'hardhat'
import { ethers } from 'hardhat'

import {
  ENSRegistry,
  BaseRegistrarImplementation,
  PublicResolver,
  BulkRenewal,
  ETHRegistrarController,
} from '../typechain-types'
import { keccak256 } from 'js-sha3'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const root = await ethers.getContract('Root')
  const registry = await ethers.getContract('ENSRegistry')

  const ETH_NAMEHASH =
    '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'

  const RESOLVER_ETH_NAMEHASH =
    '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5'
  console.log('deployer', deployer)

  const tx2 = await root
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner('0x' + keccak256('resolver.eth'), deployer)
  console.log(
    `Setting owner of eth node to registrar on root (tx: ${tx2.hash})...`,
  )
  await tx2.wait()
  console.log(
    '"resolver.eth" owner',
    await registry.owner(RESOLVER_ETH_NAMEHASH),
  )
  //
  // const resolver = (await hre.ethers.getContract(
  //   'PublicResolver',
  // )) as PublicResolver
  // console.log('resolver address', resolver.address)
  //
  // const tx = await registry
  //   .connect(await ethers.getSigner(deployer))
  //   .setResolver(RESOLVER_ETH_NAMEHASH, resolver.address)
  // await tx.wait()
  //
  // const resolverAddr2 = await registry.resolver(RESOLVER_ETH_NAMEHASH)
  // console.log('resolverAddr2', resolverAddr2)
  // console.log(
  //   '"resolver.eth" owner',
  //   await registry.owner(RESOLVER_ETH_NAMEHASH),
  // )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
