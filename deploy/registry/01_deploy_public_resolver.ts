import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')

  await deploy('PublicResolver', {
    from: deployer,
    args: [registry.address],
    log: true,
  })
}

func.id = 'public-resolver'
func.tags = ['registry', 'PublicResolver']
func.dependencies = ['ENSRegistry']

export default func
