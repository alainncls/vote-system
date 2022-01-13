import {ContractReceipt, ContractTransaction, Event, Signer} from 'ethers'
import {Election as ElectionContractType} from "./types/ethers-contracts/Election";
import {Election__factory} from "./types/ethers-contracts";
import Election from "../model/Election";

export type OnVoteCallback = (electionAddress: string, electionName: string, optionName: string) => void

class ElectionContract {
    private contract: ElectionContractType;

    constructor(electionAddress: string, etherSigner: Signer) {
        this.contract = Election__factory.connect(electionAddress, etherSigner)
    }

    async addOption(name: string, description: string): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.addOption(name, description)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event;
    }

    async removeOption(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.removeOption(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event;
    }

    async castVote(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.castVote(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event;
    }

    onVote(optionId: number, callback: OnVoteCallback) {
        this.contract.once("VoteCasted", (electionAddress, electionName, optionName) => {
            callback(electionAddress, electionName, optionName)
        })
    }

    getOptionsNumber(): Promise<number> {
        return this.contract.getOptionsNumber().then(value => value.toNumber())
    }

    getVotersNumber(): Promise<number> {
        return this.contract.getVotersNumber().then(value => value.toNumber())
    }

    async getDetails(): Promise<Election> {
        return new Election(this.contract.address, await this.contract.owner(), await this.contract.name(), await this.contract.description())
    }

}

export default ElectionContract