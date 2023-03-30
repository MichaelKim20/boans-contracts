import * as hre from 'hardhat'
import { ethers } from 'hardhat'

import {
  ENSRegistry,
  BaseRegistrarImplementation,
  PublicResolver,
  BulkRenewal,
  ETHRegistrarController,
} from '../typechain-types'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  console.log('deployer', deployer)
  const resolver = (await hre.ethers.getContract(
    'PublicResolver',
  )) as PublicResolver
  console.log('resolver address', resolver.address)

  const registrar = (await ethers.getContract(
    'BaseRegistrarImplementation',
  )) as BaseRegistrarImplementation
  console.log('registrar address', registrar.address)
  console.log('registrar owner', await registrar.owner())

  const tx = await registrar
    .connect(await ethers.getSigner(deployer))
    .setResolver(resolver.address)
  await tx.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
