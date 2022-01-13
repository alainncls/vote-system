import ContractFactory from "../config/ContractFactory";
import DirectoryContract from "../config/DirectoryContract";

class RemoveElection {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async removeElection(index: number): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        await directory.removeElection(index)
    }
}

export default RemoveElection