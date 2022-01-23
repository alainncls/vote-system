import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import GetElections from "../../src/service/GetElections";
import {hexlify} from "ethers/lib/utils";

describe('GetElections', () => {
    let contractFactory
    let getElections

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        getElections = new GetElections(contractFactory)
    })

    it('should find all elections', async () => {
        // Given
        const etherSigner = hexlify(10)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_1", "Election_Description_1")
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_2", "Election_Description_2")
        // When
        const elections = await getElections.getElections()
        // Then
        expect(elections).to.have.length(2)
        expect(elections[0].getName()).to.equal("Election_Name_1")
        expect(elections[0].getDescription()).to.equal("Election_Description_1")
        expect(elections[1].getName()).to.equal("Election_Name_2")
        expect(elections[1].getDescription()).to.equal("Election_Description_2")
    })
})
