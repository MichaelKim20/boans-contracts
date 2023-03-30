import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { PublicResolver, ENSRegistry } from '../../typechain-types'
import { keccak256 } from 'js-sha3'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const ETH_NAMEHASH =
    '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae'

  const root = await ethers.getContract('Root')
  const registry = (await ethers.getContract('ENSRegistry')) as ENSRegistry
  const controller = await ethers.getContract('ETHRegistrarController')
  const bulkRenewal = await ethers.getContract('BulkRenewal')

  const resolver = (await hre.ethers.getContract(
    'PublicResolver',
  )) as PublicResolver

  const tx1 = await root
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner('0x' + keccak256('eth'), deployer)
  console.log(
    `Setting owner of 'eth' node to registrar on root (tx: ${tx1.hash})...`,
  )
  await tx1.wait()
  const tx1_1 = await resolver['setAddr(bytes32,address)'](
    ETH_NAMEHASH,
    resolver.address,
  )
  console.log(`Setting address of 'eth' to resolver (tx: ${tx1_1.hash})...`)
  await tx1_1.wait()

  const tx2 = await registry.setSubnodeRecord(
    ETH_NAMEHASH,
    '0x' + keccak256('resolver'),
    deployer,
    resolver.address,
    0,
  )
  console.log(
    `Create 'resolver.eth' node to registrar on root (tx: ${tx2.hash})...`,
  )
  await tx2.wait()

  const tx2_1 = await resolver['setAddr(bytes32,address)'](
    '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
    resolver.address,
  )
  console.log(
    `Setting address of 'resolver.eth' to resolver (tx: ${tx2_1.hash})...`,
  )
  await tx2_1.wait()

  const tx3 = await registry.setSubnodeRecord(
    ETH_NAMEHASH,
    '0x' + keccak256('eth-usd'),
    deployer,
    resolver.address,
    0,
  )
  console.log(
    `Create 'eth-usd.eth' node to registrar on root (tx: ${tx3.hash})...`,
  )
  await tx3.wait()

  const dummyOracle = await ethers.getContract('DummyOracle')
  const tx3_1 = await resolver['setAddr(bytes32,address)'](
    '0xf51c35818c426488d1252cf0ec17c4af3ed720e9464f5ac20e75d5b861222ab5',
    dummyOracle.address,
  )
  console.log(
    `Setting address of 'eth-usd.eth' to resolver (tx: ${tx3_1.hash})...`,
  )
  await tx3_1.wait()

  const iETHRegistrarControllerInterfaceID1 = '0x018fac06'
  const iETHRegistrarControllerInterfaceID2 = '0xca27ac4c'
  const iBulkRenewalInterfaceID1 = '0x3150bfba'

  const tx201 = await resolver.setInterface(
    ETH_NAMEHASH,
    iETHRegistrarControllerInterfaceID1,
    controller.address,
  )
  console.log(
    `Setting interface of '0x018fac06' to resolver (tx: ${tx201.hash})...`,
  )
  await tx201.wait()

  const tx202 = await resolver.setInterface(
    ETH_NAMEHASH,
    iBulkRenewalInterfaceID1,
    bulkRenewal.address,
  )
  console.log(
    `Setting interface of '0x3150bfba' to resolver (tx: ${tx202.hash})...`,
  )
  await tx202.wait()

  const tx203 = await resolver.setInterface(
    ETH_NAMEHASH,
    iETHRegistrarControllerInterfaceID2,
    controller.address,
  )
  console.log(
    `Setting interface of '0x018fac06' to resolver (tx: ${tx203.hash})...`,
  )
  await tx203.wait()
}

func.tags = ['ethregistrar', 'SetInterface']
func.dependencies = [
  'registry',
  'DummyOracle',
  'ETHRegistrarController',
  'BulkRenewal',
  'PublicResolver',
]

export default func
