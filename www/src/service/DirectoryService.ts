import ContractFactory from '../config/ContractFactory'
import DirectoryContract from '../config/DirectoryContract'
import Election from '../model/Election'

class DirectoryService {
    private contractFactory: ContractFactory

    constructor(contractFactory: ContractFactory) {
        this.contractFactory = contractFactory
    }

    async addElection(name: string, description: string, endDate: number, eventListener: any): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        directory.onElectionAdd(eventListener)
        await directory.addElection(name, description, endDate)
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

    async removeElectionFromIndex(index: number, eventListener: any): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        directory.onElectionRemove(eventListener)
        await directory.removeElection(index)
    }

    async removeElectionFromAddress(address: string, eventListener: any): Promise<void> {
        const directory: DirectoryContract = this.contractFactory.getDirectoryContract()
        const electionsNumber = await directory.getElectionsNumber()

        for (let i = 0; i < electionsNumber; i++) {
            const electionAddress = await directory.getElectionAddress(i)

            if (electionAddress === address) {
                directory.onElectionRemove(eventListener)
                await directory.removeElection(i)
                break
            }
        }
    }
}

export default DirectoryService