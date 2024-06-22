import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import ConnectWallet from './ConnectWallet';
import BecomeCreatorPopup from './BecomeCreatorPopup';

const Header = ({ isAuthorized, isCreator, creatorUsername, onAuthorize }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleBecomeCreatorClick = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const handlePopupSubmit = (username, blogInfo) => {
        setIsPopupOpen(false);
        onAuthorize(true, true, username);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-title">DegenSwap</div>
                <nav className="header-nav">
                    <Link to="/users" className="header-link">Users</Link>
                    <Link to="/subscriptions" className="header-link">My Subscriptions</Link>
                </nav>
                <div className="header-actions">
                    {isAuthorized && (
                        isCreator ? (
                            <Link to={`/user/${creatorUsername}`} className="creator-button">Go to My Profile</Link>
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