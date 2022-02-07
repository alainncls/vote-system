import {ContractReceipt, ContractTransaction, Event, Signer} from 'ethers'
import {Directory as DirectoryContractType} from "./types/ethers-contracts/Directory";
import {Directory__factory} from "./types/ethers-contracts";

let directoryJson = require('../../../blockchain/build/contracts/Directory.json')
let directoryAddress = directoryJson.networks['5777'].address

class DirectoryContract {
    private contract: DirectoryContractType;

    constructor(etherSigner: Signer) {
        this.contract = Directory__factory.connect(directoryAddress, etherSigner)
    }

    async addElection(name: string, description: string): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.addElection(name, description)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event;
    }

    async removeElection(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.removeElection(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event;
    }

    getElectionsNumber(): Promise<number> {
        return this.contract.getElectionsNumber().then(value => value.toNumber())
    }

    async getElectionAddress(index: number): Promise<string> {
        return this.contract.elections(index)
    }

}

export default DirectoryContract