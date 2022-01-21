import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import GetElection from "../../src/service/GetElection";
import {hexlify} from "ethers/lib/utils";

describe('GetElection', () => {
    let contractFactory
    let getElection

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        getElection = new GetElection(contractFactory)
    })

    it('should find an election details', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        const election = await getElection.getElection(electionAddress)
        // Then
        expect(election.getOwner()).to.equal(etherSigner)
        expect(election.getOptions()).to.have.length(2)
        expect(election.getName()).to.equal("Election_Name")
        expect(election.getDescription()).to.equal("Election_Description")
    })
})
