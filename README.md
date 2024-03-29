# Vote System

[![Build Contracts](https://github.com/alainncls/vote-system/actions/workflows/build-contracts.yml/badge.svg)](https://github.com/alainncls/vote-system/actions/workflows/build-contracts.yml)
[![Build WebApp](https://github.com/alainncls/vote-system/actions/workflows/build-webapp.yml/badge.svg)](https://github.com/alainncls/vote-system/actions/workflows/build-webapp.yml)
[![Coverage Status](https://coveralls.io/repos/github/alainncls/vote-system/badge.svg?branch=main)](https://coveralls.io/github/alainncls/vote-system?branch=main)

This project aims to provide a DApp sample.  
It allows the user to create "elections", add vote options to these elections and vote on these options.

## Prerequisites

1. Download and install [Ganache](https://www.trufflesuite.com/ganache)
2. Recommendation: create a workspace associated to this project `truffle-config.js` file, to get better logs

## How to launch

This DApp is composed of 2 main folders:

* `blockchain` for the smart contracts
* `www` for the web application

### Blockchain part

1. Go to the `blockchain` folder and run `npm install`
2. Start Ganache
3. Test the contracts with `truffle test`
4. Deploy the contract via `truffle migrate`
5. Generate the TypeScript interfaces for the contracts with `npm run types`

### Web application part

1. Go to the `www` folder and run `npm install`
2. Test the frontend with `npm run test`
3. Launch the webapp with `npm run start`
4. The webapp is available at http://localhost:8080/

## To Do

_Nothing at the moment_
