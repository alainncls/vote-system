import ContractFactory from "../config/ContractFactory";
import Option from "../model/Option";

class AddOptions {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async addOptions(electionAddress: string, options: Option[]): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        for (const option of options) {
            await electionContract.addOption(option)
        }
    }
}

export default AddOptions