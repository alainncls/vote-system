import {expect} from 'chai'
import {hexlify} from "ethers/lib/utils";
import InMemoryContractFactory from "../InMemoryContractFactory";
import DirectoryService from "../../src/service/DirectoryService";

describe('AddElection', () => {
    let contractFactory
    let directoryService

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        directoryService = new DirectoryService(contractFactory)
    })

    it('should add an election', async () => {
        // Given
        const electionName = "Election_Name"
        const electionDescription = "Election_Description"
        // When
        await directoryService.addElection(electionName, electionDescription)
        // Then
        expect(contractFactory.directory.elections).to.have.length(1)
        expect(contractFactory.directory.elections[0]).to.equal(hexlify(0))
    })

    it('should find all elections', async () => {
        // Given
        const etherSigner = hexlify(10)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_1", "Election_Description_1")
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_2", "Election_Description_2")
        // When
        const elections = await directoryService.getElections()
        // Then
        expect(elections).to.have.length(2)
        expect(elections[0].getName()).to.equal("Election_Name_1")
        expect(elections[0].getDescription()).to.equal("Election_Description_1")
        expect(elections[1].getName()).to.equal("Election_Name_2")
        expect(elections[1].getDescription()).to.equal("Election_Description_2")
    })

    it('should remove an election identified by its index from the list', async () => {
        // Given
        const etherSigner = hexlify(10)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_1", "Election_Description_1")
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_2", "Election_Description_2")
        // When
        await directoryService.removeElectionFromIndex(0)
        // Then
        expect(contractFactory.directory.elections).to.have.length(1)
    })

    it('should remove an election identified by its address from the list', async () => {
        // Given
        const etherSigner = hexlify(10)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_1", "Election_Description_1")
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_2", "Election_Description_2")
        // When
        await directoryService.removeElectionFromAddress(hexlify(1))
        // Then
        expect(contractFactory.directory.elections).to.have.length(1)
    })
})
