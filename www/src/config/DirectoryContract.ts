import {BigNumber, ContractReceipt, ContractTransaction, Event, Signer} from 'ethers'
import {Directory as DirectoryContractType} from './types/ethers-contracts/Directory'
import {Directory__factory} from './types/ethers-contracts'

export type OnElectionAddCallback = (electionAddress: string, electionName: string) => void
export type OnElectionRemoveCallback = () => void

const directoryJson = require('../../../blockchain/build/contracts/Directory.json')
const directoryAddress = directoryJson.networks['5777'].address

class DirectoryContract {
    private contract: DirectoryContractType

    constructor(etherSigner: Signer) {
        this.contract = Directory__factory.connect(directoryAddress, etherSigner)
    }

    async addElection(name: string, description: string, endDate: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.addElection(name, description, endDate)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onElectionAdd(callback: OnElectionAddCallback) {
        this.contract.once('ElectionAdded', (electionAddress: string, electionName: string) => {
            callback(electionAddress, electionName)
        })
    }

    async removeElection(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.removeElection(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onElectionRemove(callback: OnElectionRemoveCallback) {
        this.contract.once('ElectionRemoved', () => {
            callback()
        })
    }

    getElectionsNumber(): Promise<number> {
        return this.contract.getElectionsNumber().then((value: BigNumber) => value.toNumber())
    }

    async getElectionAddress(index: number): Promise<string> {
        return this.contract.elections(index)
    }

}

export default DirectoryContract