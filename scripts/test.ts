import namehash from 'eth-ens-namehash'
import * as hre from 'hardhat'
import {
  ENSRegistry,
  OwnedResolver,
  TimelockController,
  BaseRegistrarImplementation,
  ETHRegistrarController,
} from '../typechain-types'
import { keccak256 } from 'boaproject-keccak256'
import { toUtf8Bytes } from 'boaproject-strings'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deployer, owner } = await getNamedAccounts()

  const factory = await hre.ethers.getContractFactory('ENSRegistry')
  const registry = factory.attach(
    '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  ) as ENSRegistry
  const node =
    '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'
  const resolverAddr = await registry.resolver(node)

  const resolverFactory = await hre.ethers.getContractFactory('OwnedResolver')
  const resolver = resolverFactory.attach(resolverAddr) as OwnedResolver
  const resolverOwnerAddr = await resolver.owner()

  const factory3 = await hre.ethers.getContractFactory('TimelockController')
  const resolverOwner = factory3.attach(resolverOwnerAddr) as TimelockController

  console.log('deployer', deployer)
  console.log('owner', owner)
  console.log('resolverAddr', resolverAddr)
  console.log('resolver owner', resolverOwnerAddr)
  console.log('min delay', (await resolverOwner.getMinDelay()).toNumber())

  const ethOwner = await registry.owner(namehash.hash('eth'))
  console.log('ENS OWNER ETH', ethOwner)
  //
  // const role1 = keccak256(toUtf8Bytes('PROPOSER_ROLE'))
  // const role2 = keccak256(toUtf8Bytes('EXECUTOR_ROLE'))
  //
  // console.log(role1)
  // console.log(role2)
  // console.log(
  //   'Role1',
  //   await resolverOwner.hasRole(
  //     role1,
  //     '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
  //   ),
  // )
  // console.log(
  //   'Role2',
  //   await resolverOwner.hasRole(
  //     role2,
  //     '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
  //   ),
  // )
  const factory4 = await hre.ethers.getContractFactory(
    'BaseRegistrarImplementation',
  )
  const contract4 = factory4.attach(ethOwner) as BaseRegistrarImplementation

  console.log('BaseRegistrarImplementation Address ', ethOwner)
  console.log('BaseRegistrarImplementation Owner', await contract4.owner())

  const ethRegistrar = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'
  const factory5 = await hre.ethers.getContractFactory('ETHRegistrarController')
  const contract5 = factory5.attach(ethRegistrar) as ETHRegistrarController
  console.log('ETHRegistrarController Address ', ethRegistrar)
  console.log('ETHRegistrarController Owner', await contract5.owner())

  const node2 = //"resolver.eth"
    '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5'
  const resolverAddr2 = await registry.resolver(node)
  console.log('resolverAddr2', resolverAddr2)
  console.log('"resolver.eth" owner', await registry.owner(node2))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
