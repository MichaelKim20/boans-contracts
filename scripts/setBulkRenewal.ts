import * as hre from 'hardhat'
import { ethers } from 'hardhat'

import {
  ENSRegistry,
  OwnedResolver,
  TimelockController,
  BaseRegistrarImplementation,
  PublicResolver,
  BulkRenewal,
  ETHRegistrarController,
} from '../typechain-types'
import namehash from 'eth-ens-namehash'

async function main() {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  console.log('deployer', deployer)
  const registry = await ethers.getContract('ENSRegistry')
  await deploy('BulkRenewal', {
    from: deployer,
    args: [registry.address],
    log: true,
  })

  const bulkRenewal = (await ethers.getContract('BulkRenewal')) as BulkRenewal
  console.log('bulkRenewal address', bulkRenewal.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
