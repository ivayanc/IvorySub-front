import React, { useState } from 'react';
import '../styles/BecomeCreatorPopup.css';


const BecomeCreatorPopup = ({ onClose, onSubmit }) => {
    const [username, setUsername] = useState('');
    const [blogInfo, setBlogInfo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(username, blogInfo);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Become a Creator</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Future Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="blogInfo">Short Information About Your Blog</label>
                        <input
                            type="text"
                            id="blogInfo"
                            value={blogInfo}
                            onChange={(e) => setBlogInfo(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                    <button type="button" className="close-button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default BecomeCreatorPopup;