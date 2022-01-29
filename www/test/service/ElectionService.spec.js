import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import ElectionService from "../../src/service/ElectionService";
import {hexlify} from "ethers/lib/utils";
import Option from "../../src/model/Option";

describe('ElectionService', () => {
    let contractFactory
    let electionService

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        electionService = new ElectionService(contractFactory)
    })

    it('should find an election details', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        const election = await electionService.getElection(electionAddress)
        // Then
        expect(election.getOwner()).to.equal(etherSigner)
        expect(election.getOptions()).to.have.length(2)
        expect(election.getName()).to.equal("Election_Name")
        expect(election.getDescription()).to.equal("Election_Description")
    })

    it('should activate an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withInactiveElection(etherSigner, "Election_Name", "Election_Description")
        // When
        await electionService.activate(electionAddress)
        // Then
        expect(contractFactory.directory.electionsContracts[0].isActive).to.be.true
    })

    it('should deactivate an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name", "Election_Description")
        // When
        await electionService.deactivate(electionAddress)
        // Then
        expect(contractFactory.directory.electionsContracts[0].isActive).to.be.false
    })

    it('should add options to an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name", "Election_Description")
        const optionsToAdd = [new Option("Option_1", "Description_1", 0), new Option("Option_2", "Description_2", 0)]
        // When
        await electionService.addOptions(electionAddress, optionsToAdd)
        // Then
        expect(contractFactory.directory.electionsContracts[0].options).to.have.length(optionsToAdd.length)
    })

    it('should cast a vote and register the voter', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        await electionService.castVote(electionAddress, 1, () => {
        })
        // Then
        expect(contractFactory.directory.electionsContracts[0].voters.length).to.equal(1)
    })

    it('should find an empty array of voters on a new election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name", "Election_Description")
        // When
        const voters = await electionService.getVoters(electionAddress)
        // Then
        expect(voters).to.have.length(0)
    })

    it('should find an array of voters on a election with votes already cast', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndVoters(etherSigner, "Election_Name", "Election_Description")
        // When
        const voters = await electionService.getVoters(electionAddress)
        // Then
        expect(voters).to.have.length(2)
    })

    it('should remove an option from an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        await electionService.removeOption(electionAddress, 1)
        // Then
        expect(contractFactory.directory.electionsContracts[0].options).to.have.length(1)
    })
})
