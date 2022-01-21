import ContractFactory from "../config/ContractFactory";

class CastVote {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async castVote(electionAddress: string, optionId: number, eventVoteListener: any): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        electionContract.onVote(optionId, eventVoteListener)
        await electionContract.castVote(optionId)
    }
}

export default CastVote