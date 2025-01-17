import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const dummyOracle = await deploy('DummyOracle', {
    from: deployer,
    args: ['100000'],
    log: true,
  })

  await deploy('StablePriceOracle', {
    from: deployer,
    args: [dummyOracle.address, [6, 5, 4, 2, 1]],
    log: true,
  })
}

func.id = 'price-oracle'
func.tags = ['ethregistrar', 'StablePriceOracle', 'DummyOracle']
func.dependencies = ['registry']

export default func
