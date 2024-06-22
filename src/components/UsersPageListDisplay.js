import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UsersPage.css';
import UserCard from './UserCard';

const UsersPageListDisplay = (users) => {
    const navigate = useNavigate();

    const handleUserClick = (username) => {
        navigate(`/user/${username}`);
    };

    return (
        <div className="users-page">
            {users.map((user, index) => (
                <UserCard key={index} username={user.username} info={user.info} onClick={() => handleUserClick(user.username)} />
            ))}
        </div>
    );
};

export default UsersPageListDisplay;