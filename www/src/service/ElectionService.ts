import ContractFactory from '../config/ContractFactory'
import Election from '../model/Election'
import Option from '../model/Option'
import ElectionContract from '../config/ElectionContract'

class ElectionService {
    private contractFactory: ContractFactory

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getElection(address: string): Promise<Election> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(address)
        return electionContract.getDetails()
    }

    async activate(electionAddress: string, eventListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onActivation(eventListener)
        await electionContract.activate()
    }

    async deactivate(electionAddress: string, eventListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onDeactivation(eventListener)
        await electionContract.deactivate()
    }

    async addOptions(electionAddress: string, options: Option[], eventListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        for (const option of options) {
            electionContract.onOptionAdd(eventListener)
            await electionContract.addOption(option)
        }
    }

    async removeOption(electionAddress: string, optionIndex: number, eventListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onOptionAdd(eventListener)
        await electionContract.removeOption(optionIndex)
    }

    async castVote(electionAddress: string, optionId: number, eventListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onVote(eventListener)
        await electionContract.castVote(optionId)
    }

    async getVoters(electionAddress: string): Promise<string[]> {
        const electionContract: ElectionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        const votersNumber: number = await electionContract.getVotersNumber()
        const voters: string[] = []
        for (let i = 0; i < votersNumber; i++) {
            voters.push(await electionContract.getVoter(i))
        }
        return voters
    }
}

export default ElectionService