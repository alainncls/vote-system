import {expect} from 'chai'
import {hexlify} from "ethers/lib/utils";
import InMemoryContractFactory from "../InMemoryContractFactory";
import AddElection from "../../src/service/AddElection";

describe('AddElection', () => {
    let contractFactory
    let addElection

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        addElection = new AddElection(contractFactory)
    })

    it('should add an election', async () => {
        // Given
        const electionName = "Election_Name"
        const electionDescription = "Election_Description"
        // When
        await addElection.addElection(electionName, electionDescription)
        // Then
        expect(contractFactory.directory.elections).to.have.length(1)
        expect(contractFactory.directory.elections[0]).to.equal(hexlify(0))
    })
})
