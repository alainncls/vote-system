import ContractFactory from "../config/ContractFactory";
import Election from "../model/Election";
import Option from "../model/Option";
import ElectionContract from "../config/ElectionContract";

class ElectionService {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getElection(address: string): Promise<Election> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(address)
        return electionContract.getDetails()
    }

    async activate(electionAddress: string): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        await electionContract.activate()
    }

    async deactivate(electionAddress: string): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        await electionContract.deactivate()
    }

    async addOptions(electionAddress: string, options: Option[]): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        for (const option of options) {
            await electionContract.addOption(option)
        }
    }

    async removeOption(electionAddress: string, optionIndex: number): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        await electionContract.removeOption(optionIndex)
    }

    async castVote(electionAddress: string, optionId: number, eventVoteListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onVote(optionId, eventVoteListener)
        await electionContract.castVote(optionId)
    }

    async getVoters(electionAddress: string): Promise<string[]> {
        const electionContract: ElectionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        const votersNumber: number = await electionContract.getVotersNumber()
        const voters: string[] = []
        for (let i = 0; i < votersNumber; i++) {
            voters.push(await electionContract.getVoter(i))
        }
        return voters;
    }
}

export default ElectionService