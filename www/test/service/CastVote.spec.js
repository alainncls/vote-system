import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import {hexlify} from "ethers/lib/utils";
import CastVote from "../../src/service/CastVote";

describe('CastVote', () => {
    let contractFactory
    let castVote

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        castVote = new CastVote(contractFactory)
    })

    it('should cast a vote and register the voter', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        await castVote.castVote(electionAddress, 1, () => {
        })
        // Then
        expect(contractFactory.directory.electionsContracts[0].voters.length).to.equal(1)
    })
})
