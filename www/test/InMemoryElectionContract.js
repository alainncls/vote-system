import {hexlify} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import Election from "../src/model/Election";

class InMemoryElectionContract {
    constructor(owner, name, description, isActive, endDate) {
        this.owner = owner;
        this.name = name;
        this.description = description;
        this.endDate = endDate;
        this.voters = [];
        this.isActive = isActive;
        this.options = [];
        this.callback = () => { // This is intentional
        }
    }

    addOption(name, description) {
        this.options.push({name, description})
        return Promise.resolve()
    }

    onOptionAdd(callback) {
        this.callback = (electionAddress, electionName, optionName) => callback(electionAddress, electionName, optionName)
    }

    removeOption(optionId) {
        this.options.splice(optionId, 1)
        return Promise.resolve()
    }

    onOptionAdd(callback) {
        this.callback = (electionAddress, electionName) => callback(electionAddress, electionName)
    }

    castVote(optionId) {
        this.options[optionId].votesCount++
        this.voters.push(hexlify(10));
        return Promise.resolve()
    }

    onVote(callback) {
        this.callback = (electionAddress, electionName, optionName) => callback(electionAddress, electionName, optionName)
    }

    getVoter(index) {
        return Promise.resolve(this.voters[index])
    }

    getDetails() {
        return new Election(hexlify(10), this.owner, this.name, this.description, this.options, true)
    }

    getOptionsNumber() {
        return Promise.resolve(BigNumber.from(this.options.length))
    }

    getVotersNumber() {
        return Promise.resolve(BigNumber.from(this.voters.length))
    }

    activate() {
        this.isActive = true
        return Promise.resolve()
    }

    onActivation(callback) {
        this.callback = (electionAddress) => callback(electionAddress)
    }

    deactivate() {
        this.isActive = false
        return Promise.resolve()
    }

    onDeactivation(callback) {
        this.callback = (electionAddress) => callback(electionAddress)
    }
}

export default InMemoryElectionContract

