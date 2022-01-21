import {hexlify} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import InMemoryElectionContract from "./InMemoryElectionContract";
import Option from "../src/model/Option";

class InMemoryDirectoryContract {
    constructor() {
        this.elections = []
        this.electionsContracts = []
    }

    addElection() {
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

    withElectionAndVoters(etherSigner, electionName, electionDescription) {
        const address = this.withElection(etherSigner, electionName, electionDescription)
        this.electionsContracts[0].voters = [hexlify(11), hexlify(12)]
        return address
    }

    withElectionAndOptions(etherSigner, electionName, electionDescription) {
        const address = this.withElection(etherSigner, electionName, electionDescription)
        this.electionsContracts[0].options = [new Option("Option_1", "Description_1", BigNumber.from(0)), new Option("Option_2", "Description_2", BigNumber.from(0))]
        return address
    }
}

export default InMemoryDirectoryContract
