import InMemoryDirectoryContract from "./InMemoryDirectoryContract";
import {hexlify} from "ethers/lib/utils";

class InMemoryContractFactory {

    constructor() {
        this.etherSigner = hexlify(10)
        this.directory = new InMemoryDirectoryContract(this.etherSigner)
    }

    getDirectoryContract() {
        return this.directory
    }

    createElectionContractFromAddress(address) {
        const electionId = this.directory.elections.indexOf(address)
        return this.directory.electionsContracts[electionId]
    }

    async createElectionContractFromId(electionId) {
        return Promise.resolve(this.directory.electionsContracts[electionId])
    }

}

export default InMemoryContractFactory
