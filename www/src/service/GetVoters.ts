import ContractFactory from "../config/ContractFactory";
import ElectionContract from "../config/ElectionContract";

class GetVoters {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getVoters(electionAddress: string): Promise<string[]> {
        const electionContract: ElectionContract = await this.contractFactory.createElectionContractFromAddress(electionAddress)
        const votersNumber: number = await electionContract.getVotersNumber()
        const voters: string[] = [];
        for (let i = 0; i < votersNumber; i++) {
            voters.push(await electionContract.getVoter(i))
        }
        return voters;
    }
}

export default GetVoters