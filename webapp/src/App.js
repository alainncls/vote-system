import React from 'react';
import useEthAddressAndBalance from './useEthAddressAndBalance';
import './App.css';

export default function App() {
    const account = useEthAddressAndBalance();

    return (
        <div className="app">
            <p>Your address is</p>
            <h1>{account.address}</h1>
            <p>Your balance is</p>
            <h1>{account.balance} ETH</h1>
        </div>
    );
}
