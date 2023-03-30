import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const priceOracle = await ethers.getContract('StablePriceOracle')

  const controller = await deploy('ETHRegistrarController', {
    from: deployer,
    args: [registrar.address, priceOracle.address, 60, 86400],
    log: true,
  })

  const tx1 = await registrar.addController(controller.address, {
    from: deployer,
  })
  console.log(
    `Adding controller as controller on registrar (tx: ${tx1.hash})...`,
  )
  await tx1.wait()
}

func.tags = ['ethregistrar', 'ETHRegistrarController']
func.dependencies = ['registry', 'BaseRegistrarImplementation']

export default func
