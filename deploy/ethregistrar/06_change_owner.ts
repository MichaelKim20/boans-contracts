import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BulkRenewal, PublicResolver } from '../../typechain-types'
import { keccak256 } from 'js-sha3'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const root = await ethers.getContract('Root')
  const registry = await ethers.getContract('ENSRegistry')
  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const resolver = (await hre.ethers.getContract(
    'PublicResolver',
  )) as PublicResolver

  const tx301 = await root
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner('0x' + keccak256('eth'), registrar.address)
  console.log(
    `Setting owner of eth node to registrar on root (tx: ${tx301.hash})...`,
  )
  await tx301.wait()

  const tx401 = await registrar
    .connect(await ethers.getSigner(deployer))
    .setResolver(resolver.address)
  console.log(`Setting resolver to registrar (tx: ${tx401.hash})...`)
  await tx401.wait()
}

func.tags = ['ethregistrar', 'ChangeOwner']
func.dependencies = [
  'registry',
  'ETHRegistrarController',
  'BulkRenewal',
  'PublicResolver',
  'SetInterface',
]

export default func
