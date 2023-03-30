import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')

  const ownedResolver = await deploy('OwnedResolver', {
    from: deployer,
    args: [],
    log: true,
  })
}

func.id = 'owned-resolver'
func.tags = ['resolvers', 'OwnedResolver']
func.dependencies = ['registry']

export default func
