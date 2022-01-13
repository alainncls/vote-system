import ContractFactory from "../config/ContractFactory";
import DirectoryContract from "../config/DirectoryContract";
import Election from "../model/Election";

class GetElections {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getElections(): Promise<Election[]> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        const electionsNumber = await directory.getElectionsNumber()
        const elections: Election[] = []

        for (let i = 0; i < electionsNumber; i++) {
            const electionContract = await this.contractFactory.createElectionContractFromId(i)
            elections.push(await electionContract.getDetails())
        }

        return elections
    }
}

export default GetElections