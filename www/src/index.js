import page from 'page'

import EtherProvider from './config/EtherProvider'

import ContractFactory from './config/ContractFactory'

import {render} from 'lit-html'
import {footer, header, layout, viewLoading, viewNotFound} from './view'
// notifications
import Noty from 'noty'
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
    const account = await provider.getAccount()
    // factory
    const contractFactory = new ContractFactory(etherSigner)
    // services

    // Homepage
    page('/', async function () {
        displayLoading()
        render(layout(header(), viewNotFound, footer()), wrapper)
    })


    // not found
    page('*', function () {
        render(layout(header(), viewNotFound(), footer()), wrapper)
    })

    // int router
    page({hashbang: true})
})()
