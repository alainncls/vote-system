import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import GetVoters from "../../src/service/GetVoters";
import {hexlify} from "ethers/lib/utils";

describe('GetVoters', () => {
    let contractFactory
    let getVoters

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        getVoters = new GetVoters(contractFactory)
    })

    it('should find an empty array of voters on a new election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElection(etherSigner, "Election_Name", "Election_Description")
        // When
        const voters = await getVoters.getVoters(electionAddress)
        // Then
        expect(voters).to.have.length(0)
    })
})
