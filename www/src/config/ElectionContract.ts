import {ContractReceipt, ContractTransaction, Event, Signer} from 'ethers'
import {Election as ElectionContractType} from './types/ethers-contracts/Election'
import {Election__factory} from './types/ethers-contracts'
import Election from '../model/Election'
import Option from '../model/Option'

export type OnOptionAddCallback = (electionAddress: string, electionName: string, optionName: string) => void
export type OnOptionRemoveCallback = (electionAddress: string, electionName: string) => void
export type OnVoteCallback = (electionAddress: string, electionName: string, optionName: string) => void
export type OnActivationCallback = (electionAddress: string) => void
export type OnDeactivationCallback = (electionAddress: string) => void

class ElectionContract {
    private contract: ElectionContractType

    constructor(electionAddress: string, etherSigner: Signer) {
        this.contract = Election__factory.connect(electionAddress, etherSigner)
    }

    async addOption(rawOption: any): Promise<boolean> {
        const option: Option = new Option(rawOption.name, rawOption.description, 0)
        const transaction: ContractTransaction = await this.contract.addOption(option.getName(), option.getDescription())
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onOptionAdd(callback: OnOptionAddCallback) {
        this.contract.once('OptionAdded', (electionAddress, electionName, optionName) => {
            callback(electionAddress, electionName, optionName)
        })
    }

    async removeOption(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.removeOption(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onOptionRemove(callback: OnOptionRemoveCallback) {
        this.contract.once('OptionRemoved', (electionAddress, electionName) => {
            callback(electionAddress, electionName)
        })
    }

    async castVote(index: number): Promise<boolean> {
        const transaction: ContractTransaction = await this.contract.castVote(index)
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onVote(callback: OnVoteCallback) {
        this.contract.once('VoteCasted', (electionAddress, electionName, optionName) => {
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
        return this.contract.voters(index)
    }

    async getDetails(): Promise<Election> {
        const optionsNumber: number = await this.contract.getOptionsNumber().then(value => value.toNumber())
        const options: Option[] = []
        if (optionsNumber > 0) {
            for (let i = 0; i < optionsNumber; i++) {
                const rawOption: any = await this.contract.options(i)
                options.push(new Option(rawOption.name, rawOption.description, rawOption.votesCount))
            }
        }
        return new Election(this.contract.address, await this.contract.owner(), await this.contract.name(), await this.contract.description(), options, await this.contract.isActive())
    }

    async getOwner(): Promise<string> {
        return this.contract.owner()
    }

    async activate() {
        const transaction: ContractTransaction = await this.contract.activate()
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onActivation(callback: OnActivationCallback) {
        this.contract.once('Activated', (electionAddress) => {
            callback(electionAddress)
        })
    }

    async deactivate() {
        const transaction: ContractTransaction = await this.contract.deactivate()
        const receipt: ContractReceipt = await transaction.wait(1)
        const event: Event = receipt.events.pop()
        return !!event
    }

    onDeactivation(callback: OnDeactivationCallback) {
        this.contract.once('Deactivated', (electionAddress) => {
            callback(electionAddress)
        })
    }
}

export default ElectionContract