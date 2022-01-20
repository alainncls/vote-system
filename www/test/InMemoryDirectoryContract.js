import {hexlify} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import InMemoryElectionContract from "./InMemoryElectionContract";

class InMemoryDirectoryContract {
    constructor() {
        this.elections = []
        this.electionsContracts = []
    }

    addElection(name, description) {
        this.elections.push(hexlify(this.elections.length))
        return Promise.resolve()
    }

    removeElection(index) {
        this.elections.splice(index, 1)
        return Promise.resolve()
    }

    getElectionsNumber() {
        return Promise.resolve(BigNumber.from(this.elections.length))
    }

    withElection(etherSigner, electionName, electionDescription) {
        let address = hexlify(this.elections.length);
        this.elections.push(address)
        this.electionsContracts.push(new InMemoryElectionContract(etherSigner, electionName, electionDescription))
        return address
    }
}

export default InMemoryDirectoryContract
