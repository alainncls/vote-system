import page from 'page'

import EtherProvider from './config/EtherProvider'

import ContractFactory from './config/ContractFactory'

import {render} from 'lit-html'
import {footer, header, layout, viewCreateElection, viewDisplayElection, viewElections, viewLoading, viewNotFound} from './view'
// notifications
import 'noty/lib/noty.css'
import 'noty/lib/themes/light.css'
import GetElections from "./service/GetElections";
import GetElection from "./service/GetElection";
import AddElection from "./service/AddElection";
import CastVote from "./service/CastVote";
import AddOptions from "./service/AddOption";
import GetVoters from "./service/GetVoters";

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
    const getElection = new GetElection(contractFactory)
    const getElections = new GetElections(contractFactory)
    const addElection = new AddElection(contractFactory)
    const castVote = new CastVote(contractFactory)
    const addOptions = new AddOptions(contractFactory)
    const getVoters = new GetVoters(contractFactory)

    // Homepage
    page('/', async function () {
        displayLoading()
        const elections = await getElections.getElections()
        const view = viewElections(elections)
        render(layout(header(), view, footer()), wrapper)
    })

    // Create election
    page('/new', async function () {
        displayLoading()
        const view = viewCreateElection(addElection)
        render(layout(header(), view, footer()), wrapper)
    })

    // Display election
    page('/:address', async function (ctx) {
        displayLoading()
        const electionAddress = ctx.params.address
        const election = await getElection.getElection(electionAddress)
        const voters = await getVoters.getVoters(electionAddress)
        const hasVoted = voters.includes(account)
        const view = viewDisplayElection(election, castVote, addOptions, hasVoted)
        render(layout(header(), view, footer()), wrapper)
    })

    // not found
    page('*', function () {
        render(layout(header(), viewNotFound(), footer()), wrapper)
    })

    // int router
    page({hashbang: true})
})()