import {hexlify} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import Election from "../src/model/Election";

class InMemoryElectionContract {
    constructor(owner, name, description) {
        this.owner = owner;
        this.name = name;
        this.description = description;
        this.voters = [];
        this.isActive = true;
        this.options = [];
        this.callback = () => { // This is intentional
        }
    }

    addOption(name, description) {
        this.options.push({name, description})
        return Promise.resolve()
    }

    removeOption(optionId) {
        this.options.splice(optionId, 1)
        return Promise.resolve()
    }

    castVote(optionId) {
        this.options[optionId].votesCount++
        this.voters.push(hexlify(10));
        return Promise.resolve()
    }

    onVote(optionId, callback) {
        this.callback = (address) => callback(address, optionId)
    }

    getVoter(index) {
        return Promise.resolve(this.voters[index])
    }

    getDetails() {
        return new Election(hexlify(10), this.owner, this.name, this.description, this.options)
    }

    getOptionsNumber() {
        return Promise.resolve(BigNumber.from(this.options.length))
    }

    getVotersNumber() {
        return Promise.resolve(BigNumber.from(this.voters.length))
    }

}

export default InMemoryElectionContract

