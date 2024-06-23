import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UsersPage.css';
import UserCard from './UserCard';

const UsersPageListDisplay = ({ users }) => {
    const navigate = useNavigate();

    const handleUserClick = (username) => {
        navigate(`/user/${username}`);
    };

    if (!users || Object.keys(users).length === 0) {
        return <div className="users-page">Loading...</div>;
    }

    return (
        <div className="users-page">
            {Object.values(users).map((user, index) => (
                <UserCard 
                    key={index} 
                    username={user.username} 
                    info={user.shortInfo} 
                    onClick={() => handleUserClick(user.username)} 
                />
            ))}
        </div>
    );
};

export default UsersPageListDisplay;
