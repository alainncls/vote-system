import ContractFactory from "../config/ContractFactory";

class Deactivate {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async deactivate(electionAddress: string): Promise<void> {
        const electionContract = this.contractFactory.createElectionContractFromAddress(electionAddress)
        console.log('deactivate')
        await electionContract.deactivate()
    }
}

export default Deactivate