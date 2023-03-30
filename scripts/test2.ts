import namehash from 'eth-ens-namehash'
import * as hre from 'hardhat'
import { keccak256 } from 'js-sha3'
import {
  ENSRegistry,
  OwnedResolver,
  TimelockController,
  BaseRegistrarImplementation,
  ETHRegistrarController,
} from '../typechain-types'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deployer, owner } = await getNamedAccounts()

  const factory = await hre.ethers.getContractFactory('ENSRegistry')
  const registry = factory.attach(
    '0x8ec078ecC2779959136eE870475c02204B7eA93d',
  ) as ENSRegistry
  const node =
    '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'
  // const resolverAddr = await registry.resolver(node)
  //
  // const resolverFactory = await hre.ethers.getContractFactory('OwnedResolver')
  // const resolver = resolverFactory.attach(resolverAddr) as OwnedResolver
  // const resolverOwnerAddr = await resolver.owner()
  //
  // const factory3 = await hre.ethers.getContractFactory('TimelockController')
  // const resolverOwner = factory3.attach(resolverOwnerAddr) as TimelockController

  console.log('deployer', deployer)
  console.log('owner', owner)
  // console.log('resolverAddr', resolverAddr)
  // console.log('resolver owner', resolverOwnerAddr)
  // console.log('min delay', (await resolverOwner.getMinDelay()).toNumber())

  const ethOwner = await registry.owner(node)
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

  const ethRegistrar = '0x489Ef57AC2ACA89d768C4d02CEb9cF5b4c527f3B'
  const factory5 = await hre.ethers.getContractFactory('ETHRegistrarController')
  const contract5 = factory5.attach(ethRegistrar) as ETHRegistrarController
  console.log('ETHRegistrarController Address ', ethRegistrar)
  console.log('ETHRegistrarController Owner', await contract5.owner())

  const address = await registry.resolver(node)
  console.log('resolve address(eth)', address)
  console.log('resolve owner(eth)', await registry.owner(node))

  const node2 = //"resolver.eth"
    '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5'
  const resolverAddr2 = await registry.resolver(node2)
  console.log('resolve address(resolver.eth)', resolverAddr2)
  console.log('resolve owner(resolver.eth)', await registry.owner(node2))
  ;('0x37a3e171d3f40e5856a205b09d26bcf36580cb6d082630411a69a4ebb33e4d41')
  const node3 = //"bosagora2.eth"
    '0x37a3e171d3f40e5856a205b09d26bcf36580cb6d082630411a69a4ebb33e4d41'
  const resolverAddr3 = await registry.resolver(node3)
  console.log('resolve address(bosagora2.eth)', resolverAddr3)
  console.log('resolve owner(bosagora2.eth)', await registry.owner(node3))

  await registry.setResolver(
    '0x6d255fc3390ee6b41191da315958b7d6a1e5b17904cc7683558f98acc57977b4',
    address,
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
