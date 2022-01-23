import ContractFactory from "../config/ContractFactory";

class Activate {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async activate(electionAddress: string): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        await electionContract.activate()
    }
}

export default Activate