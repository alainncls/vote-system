import ContractFactory from "../config/ContractFactory";
import DirectoryContract from "../config/DirectoryContract";

class AddElection {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async addElection(name: string, description: string): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        await directory.addElection(name, description)
    }
}

export default AddElection