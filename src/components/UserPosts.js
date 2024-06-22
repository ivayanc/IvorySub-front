import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles//UserPosts.css';
import { FaStar } from 'react-icons/fa';


const userPosts = {
    user1: [
        { title: 'First Post', text: 'This is the first post of user1' },
        { title: 'Second Post', text: 'This is the second post of user1' },
    ],
    user2: [
        { title: 'First Post', text: 'This is the first post of user2' },
        { title: 'Second Post', text: 'This is the second post of user2' },
    ],
    // Add posts for other users as needed
};

const users = {
    user1: { username: 'user1', info: 'Detailed info about user1', rating: 4.8 },
    user2: { username: 'user2', info: 'Detailed info about user2', rating: 4.5 },
    // Add more users as needed
};

const UserPage = () => {
    const { username } = useParams();
    const user = users[username];
    const posts = userPosts[username];

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionDate, setSubscriptionDate] = useState(null);

    const handleSubscribe = () => {
        setIsSubscribed(true);
        const currentDate = new Date();
        const subscriptionEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); // Subscription for 1 month
        setSubscriptionDate(subscriptionEndDate);
    };

    const handleCancelSubscription = () => {
        setIsSubscribed(false);
        setSubscriptionDate(null);
    };

    if (!user || !posts) {
        return <div className="user-page">User not found</div>;
    }

    return (
        <div className="user-page">
            <div className="user-posts">
                {posts.map((post, index) => (
                    <div key={index} className="post-card">
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-text">{isSubscribed ? post.text : "Subscribe to view the full content."}</p>
                    </div>
                ))}
                {!isSubscribed && <div className="blur-overlay">Subscribe to view the full content</div>}
            </div>
            <div className="user-info">
                <div className="user-header">
                    <h2 className="user-name">{user.username}</h2>
                    <div className="user-rating">
                        <FaStar className="star-icon" /> {user.rating}/5
                    </div>
                </div>
                <p className="user-details">{user.info}</p>
                {isSubscribed ? (
                    <div className="subscription-info">
                        Subscription will be updated at {subscriptionDate.toLocaleDateString()}
                        <button className="cancel-button" onClick={handleCancelSubscription}>Cancel Subscription</button>
                    </div>
                ) : (
                    <button className="wallet-button" onClick={handleSubscribe}>Subscribe</button>
                )}
            </div>
        </div>
    );
};

export default UserPage;