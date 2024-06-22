import React from 'react';
import '../styles/UserCard.css';

const UserCard = ({ username, info, onClick }) => {
    return (
        <div className="user-card" onClick={onClick}>
            <h3>{username}</h3>
            <p>{info}</p>
        </div>
    );
};

export default UserCard;