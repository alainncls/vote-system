import page from 'page'
import EtherProvider from './config/EtherProvider'
import ContractFactory from './config/ContractFactory'
import DirectoryService from "./service/DirectoryService";
import ElectionService from "./service/ElectionService";

import {render} from 'lit-html'
import {footer, header, layout, viewCreateElection, viewDisplayElection, viewElections, viewLoading, viewNotFound} from './view'

// notifications
import 'noty/lib/noty.css'
import 'noty/lib/themes/light.css'

// bind app
const wrapper = document.querySelector('#app')

const displayLoading = () => {
        render(layout(header(), viewLoading(), footer()), wrapper)
    }

// bootstrap
;(async function () {
    displayLoading()

    // provider
    const provider = new EtherProvider()
    const etherSigner = provider.getSigner()
    // factory
    const contractFactory = new ContractFactory(etherSigner)
    const account = await provider.getAccount()
    // services
    const electionService = new ElectionService(contractFactory)
    const directoryService = new DirectoryService(contractFactory)

    // Homepage
    page('/', async function () {
        displayLoading()
        const elections = await directoryService.getElections()
        const view = viewElections(elections)
        render(layout(header(account), view, footer()), wrapper)
    })

    // Create election
    page('/new', async function () {
        displayLoading()
        const view = viewCreateElection(directoryService)
        render(layout(header(account), view, footer()), wrapper)
    })

    // Display election
    page('/:address', async function (ctx) {
        displayLoading()
        const electionAddress = ctx.params.address
        const election = await electionService.getElection(electionAddress)
        const voters = await electionService.getVoters(electionAddress)
        const hasVoted = voters.includes(account)
        const isOwner = election.getOwner() === account;
        const view = viewDisplayElection(election, electionService, hasVoted, isOwner, directoryService)
        render(layout(header(account), view, footer()), wrapper)
    })

    // not found
    page('*', function () {
        render(layout(header(account), viewNotFound(), footer()), wrapper)
    })

    // int router
    page({hashbang: true})
})()
