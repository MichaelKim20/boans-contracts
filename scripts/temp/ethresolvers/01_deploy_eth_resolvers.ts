import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const nameWrapper = await ethers.getContract('NameWrapper')
  const controller = await ethers.getContract('ETHRegistrarController')
  const reverseRegistrar = await ethers.getContract('ReverseRegistrar')

  const ownedResolver = await deploy('OwnedResolver', {
    from: deployer,
    args: [
      registry.address,
      nameWrapper.address,
      controller.address,
      reverseRegistrar.address,
    ],
    log: true,
  })

  const tx = await reverseRegistrar.setDefaultResolver(ownedResolver.address, {
    from: deployer,
  })
  console.log(
    `Setting default resolver on ReverseRegistrar to resolver (tx: ${tx.hash})...`,
  )
  await tx.wait()
}

func.tags = ['ethresolver']
func.dependencies = [
  'registry',
  'wrapper',
  'BaseRegistrarImplementation',
  'resolvers',
]

export default func
