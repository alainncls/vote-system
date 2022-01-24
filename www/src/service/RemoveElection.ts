import ContractFactory from "../config/ContractFactory";
import DirectoryContract from "../config/DirectoryContract";

class RemoveElection {
    private contractFactory: ContractFactory;

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async removeElectionFromIndex(index: number): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        await directory.removeElection(index)
    }

    async removeElectionFromAddress(address: string): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        const electionsNumber = await directory.getElectionsNumber()

        for (let i = 0; i < electionsNumber; i++) {
            const electionAddress = await directory.getElectionAddress(i)

            if (electionAddress === address) {
                await directory.removeElection(i)
                break
            }
        }
    }
}

export default RemoveElection