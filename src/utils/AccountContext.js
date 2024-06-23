// src/utils/AccountContext.js
import React, { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [ethBalance, setEthBalance] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [creatorUsername, setCreatorUsername] = useState('');
    const [creatorDesc, setCreatorDesc] = useState('');
    
    return (
        <AccountContext.Provider value={{ account, setAccount, ethBalance, setEthBalance, isCreator, setIsCreator, creatorUsername, setCreatorUsername, creatorDesc, setCreatorDesc }}>
            {children}
        </AccountContext.Provider>
    );
};
