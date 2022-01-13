import ContractFactory from "../config/ContractFactory";
import Election from "../model/Election";

class GetElection {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getElection(address: string): Promise<Election> {
        const electionContract = await this.contractFactory.createElectionContractFromAddress(address)
        return await electionContract.getDetails()
    }
}

export default GetElection