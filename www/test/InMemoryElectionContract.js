import {BigNumber} from "ethers";

class InMemoryElectionContract {
    constructor(owner, name, description) {
        this.owner = owner;
        this.name = name;
        this.description = description;
        this.voters = [];
        this.isActive = true;
        this.options = [];
    }

    addOption(name, description) {
        this.options.push({name, description})
        return Promise.resolve()
    }

    removeOption(index) {
        this.options.splice(index, 1)
        return Promise.resolve()
    }

    castVote(index, userAddress) {
        this.options[index].votesCount = this.options[index].votesCount.add(BigNumber.from("1"))
        this.voters.push(userAddress);
        return Promise.resolve()
    }

    getOptionsNumber() {
        return Promise.resolve(BigNumber.from(this.options.length))
    }

    getVotersNumber() {
        return Promise.resolve(BigNumber.from(this.voters.length))
    }

}

export default InMemoryElectionContract

