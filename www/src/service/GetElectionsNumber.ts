import ContractFactory from "../config/ContractFactory";
import DirectoryContract from "../config/DirectoryContract";

class GetElectionsNumber {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async getElectionsNumber(): Promise<number> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        return directory.getElectionsNumber()
    }
}

export default GetElectionsNumber