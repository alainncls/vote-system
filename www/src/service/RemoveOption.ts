import ContractFactory from "../config/ContractFactory";

class RemoveOption {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async removeOption(electionAddress: string, optionIndex: number): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        await electionContract.removeOption(optionIndex)
    }
}

export default RemoveOption