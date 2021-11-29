import {useCallback, useEffect, useRef, useState} from 'react';
import {ethers} from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum)

const signer = provider.getSigner();

export default function useEthAddressAndBalance() {
    const [address, setAddress] = useState('0x0000000000000000000000000000000000000000');
    const [balance, setBalance] = useState(0);
    const prevBalanceRef = useRef(0);

    const fetchAddress = useCallback(async () => {
        await provider.send("eth_requestAccounts", []);
        setAddress(await signer.getAddress());
    }, []);

    const fetchBalance = useCallback(async () => {
        const rawBalance = await provider.getBalance(address);
        const value = parseFloat(ethers.utils.formatEther(rawBalance));

        if (value !== prevBalanceRef.current) {
            prevBalanceRef.current = value;
            setBalance(value);
        }
    }, [address]);

    useEffect(() => {
        fetchAddress();
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    useEffect(() => {
        provider.on('block', fetchBalance);

        return () => {
            provider.off('block', fetchBalance);
        };
    }, [fetchBalance]);

    return {address, balance};
}
