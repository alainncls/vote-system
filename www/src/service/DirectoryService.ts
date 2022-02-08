import ContractFactory from '../config/ContractFactory'
import DirectoryContract from '../config/DirectoryContract'
import Election from '../model/Election'

class DirectoryService {
    private contractFactory: ContractFactory

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async addElection(name: string, description: string): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        await directory.addElection(name, description)
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

export default DirectoryService