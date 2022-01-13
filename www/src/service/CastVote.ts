import ContractFactory from "../config/ContractFactory";

class AddElection {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async castVote(electionAddress: string, optionId: number, eventVoteListener: any): Promise<void> {
        const electionContract = await this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onVote(optionId, eventVoteListener)
        await electionContract.castVote(optionId)
    }
}

export default AddElection