import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import ConnectWallet from './ConnectWallet';
import BecomeCreatorPopup from './BecomeCreatorPopup';
import { useAccount } from '../utils/AccountContext';
import { useGun } from '../utils/GunContext';

const Header = ({ isAuthorized, onAuthorize }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { account, isCreator, setIsCreator, setCreatorUsername, setCreatorDesc } = useAccount();
    const gun = useGun();

    const handleBecomeCreatorClick = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const handlePopupSubmit = (username, blogInfo) => {
        setIsPopupOpen(false);
        if (gun){
            gun.get(`users`).get(account).put({ 
                isCreator: true, 
                username: username,
                shortInfo: blogInfo 
            });
            gun.get(`username-account`).get(username).put({ 
                account: account
            });
            
        }
    };

    useEffect(() => {
        if (isAuthorized && gun) {
            const user = gun.get(`users`).get(account); 
            user.map().on((userInfo, id) => {
                if(`${id}` === 'isCreator'){
                    setIsCreator(true);
                }
                if(`${id}` === 'username'){
                    setCreatorUsername(userInfo)
                }
                if(`${id}` === 'shortInfo'){
                    setCreatorDesc(userInfo)
                }
            });
        }
    }, [gun, account, setIsCreator, setCreatorUsername, isAuthorized]);

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-title">IvorySub</div>
                <nav className="header-nav">
                    <Link to="/users" className="header-link">Users</Link>
                    <Link to="/subscriptions" className="header-link">My Subscriptions</Link>
                </nav>
                <div className="header-actions">
                    {isAuthorized && (
                        isCreator ? (
                            <Link to={`/settings`} className="creator-button">Go to My Profile</Link>
                        ) : (
                            <button className="creator-button" onClick={handleBecomeCreatorClick}>Become Creator</button>
                        )
                    )}
                    <ConnectWallet onAuthorize={onAuthorize} />
                </div>
            </div>
            {isPopupOpen && (
                <BecomeCreatorPopup onClose={handlePopupClose} onSubmit={handlePopupSubmit} />
            )}
        </header>
    );
};

export default Header;