import {ContractReceipt, ContractTransaction, Event, Signer} from 'ethers'
import {Election as ElectionContractType} from "./types/ethers-contracts/Election";
import {Election__factory} from "./types/ethers-contracts";
import Election from "../model/Election";
import Option from "../model/Option";

export type OnVoteCallback = (electionAddress: string, electionName: string, optionName: string) => void

class ElectionContract {
    private contract: ElectionContractType;

    constructor(electionAddress: string, etherSigner: Signer) {
        this.contract = Election__factory.connect(electionAddress, etherSigner)
    }

    async addOption(rawOption: any): Promise<boolean> {
        console.log('rawOption',rawOption)
        const option: Option = new Option(rawOption.name, rawOption.description, 0)
        console.log('option',option)
        const transaction: ContractTransaction = await this.contract.addOption(option.getName(), option.getDescription())
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

    async getVoter(index: number): Promise<string> {
        return await this.contract.voters(index)
    }

    async getDetails(): Promise<Election> {
        const optionsNumber: number = await this.contract.getOptionsNumber().then(value => value.toNumber())
        const options: Option[] = []
        if (optionsNumber > 0) {
            for (let i = 0; i < optionsNumber; i++) {
                const rawOption: any = await this.contract.options(i)
                console.log('rawOption', rawOption)
                options.push(new Option(rawOption.name, rawOption.description, rawOption.votesCount))
            }
        }
        return new Election(this.contract.address, await this.contract.owner(), await this.contract.name(), await this.contract.description(), options)
    }

}

export default ElectionContract