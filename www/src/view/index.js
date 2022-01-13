import {html} from 'lit-html'

// bind app
const layout = (header, content, footer) => html`
    <div class="">
        <div class="header">${header}</div>
        <div class="container">${content}</div>
        <div class="footer">${footer}</div>
    </div>`

const header = () => html`
    <header class="navbar">
        <section class="navbar-center">
            <a href="/" class="btn btn-link sitename">Vote System</a>
            <a href="/" class="btn btn-link">All Elections</a>
            <a href="/new" class="btn btn-link">Create election</a>
        </section>
    </header>`

const footer = () => html`
    <footer class="text-center">
        <div>
            Vote System built and designed with
            <span class="text-error">♥</span> by <a href="https://alainnicolas.fr" target="_blank">Alain Nicolas</a>
        </div>
    </footer>`

// views
const viewLoading = () => html`
    <div class="loading loading-lg"></div>`

const viewNotFound = () => html`
    <div>Not found !</div>`

export {
    layout,
    header,
    footer,
    viewLoading,
    viewNotFound,
}
