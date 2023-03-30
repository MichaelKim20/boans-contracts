import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BulkRenewal } from '../../typechain-types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  await deploy('BulkRenewal', {
    from: deployer,
    args: [registry.address],
    log: true,
  })
}

func.tags = ['ethregistrar', 'BulkRenewal']
func.dependencies = ['registry', 'ETHRegistrarController']

export default func
