import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import '../styles/ConnectWallet.css';
import { useAccount } from '../utils/AccountContext';

const ConnectWallet = ({ onAuthorize }) => {
    const { account, setAccount, ethBalance, setEthBalance } = useAccount();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const disconnectWallet = useCallback(() => {
        if (account) {
            setAccount(null);
            setEthBalance(null);
            localStorage.removeItem('account');
            setDropdownOpen(false);
            if (onAuthorize) onAuthorize(false, false, '');
        }
    }, [account, onAuthorize, setAccount, setEthBalance]);

    useEffect(() => {
        const savedAccount = localStorage.getItem('account');
        if (savedAccount && !account) {
            setAccount(savedAccount);
            fetchBalance(savedAccount);
            onAuthorize(true, false, savedAccount); // Assuming not a creator initially
        }

        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    const newAccount = accounts[0];
                    setAccount(newAccount);
                    localStorage.setItem('account', newAccount);
                    fetchBalance(newAccount);
                    onAuthorize(true, false, newAccount); // Assuming not a creator initially
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, [account, disconnectWallet, onAuthorize, setAccount]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                if (address !== account) {
                    setAccount(address);
                    localStorage.setItem('account', address);
                    fetchBalance(address);
                    onAuthorize(true, false, address); // Assuming not a creator initially
                }
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    };

    const fetchBalance = async (address) => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const balance = await provider.getBalance(address);
                setEthBalance(Number(ethers.formatEther(balance)).toFixed(6));
            } catch (error) {
                console.error("Error fetching balance: ", error);
            }
        }
    };

    const handleAccountClick = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="wallet-container">
            {account ? (
                <div className="wallet-info">
                    <span className="wallet-account" onClick={handleAccountClick}>
                        <span className="wallet-balance">{ethBalance} ETH</span> {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </span>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={disconnectWallet}>Disconnect</div>
                        </div>
                    )}
                </div>
            ) : (
                <button className="wallet-button" onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default ConnectWallet;
