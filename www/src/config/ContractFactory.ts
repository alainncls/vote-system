import {Signer} from "ethers";
import DirectoryContract from "./DirectoryContract";
import ElectionContract from "./ElectionContract";

class ContractFactory {
    private etherSigner: Signer;
    private directory: DirectoryContract;

    constructor(etherSigner: Signer) {
        this.etherSigner = etherSigner
        this.directory = new DirectoryContract(etherSigner)
    }

    getDirectoryContract(): DirectoryContract {
        return this.directory
    }

    createElectionContractFromAddress(address: string): ElectionContract {
        return new ElectionContract(address, this.etherSigner)
    }

    async createElectionContractFromId(electionId: number): Promise<ElectionContract> {
        let electionAddress = await this.directory.getElectionAddress(electionId)
        return this.createElectionContractFromAddress(electionAddress)
    }

}

export default ContractFactory
