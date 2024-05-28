import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_ABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);

function App() {
    const { active, account, library, activate, deactivate } = useWeb3React();
    const [betAmount, setBetAmount] = useState('');
    const [message, setMessage] = useState('');
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (library) {
            const web3 = new Web3(library.provider);
            const slotMachineContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(slotMachineContract);
        }
    }, [library]);

    const connect = async () => {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    };

    const disconnect = async () => {
        try {
            deactivate();
        } catch (ex) {
            console.log(ex);
        }
    };

    const playGame = async () => {
        if (!contract) return;

        try {
            await contract.methods.play().send({ from: account, value: Web3.utils.toWei(betAmount, 'ether') });
            setMessage('Transaction successful!');
        } catch (error) {
            setMessage(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Slot Machine Game</h1>
            {active ? (
                <div>
                    <p>Connected with <b>{account}</b></p>
                    <button onClick={disconnect}>Disconnect</button>
                </div>
            ) : (
                <button onClick={connect}>Connect to MetaMask</button>
            )}

            <input
                type="text"
                placeholder="Bet amount in ETH"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
            />
            <button onClick={playGame}>Play</button>
            <p>{message}</p>
        </div>
    );
}

export default App;
