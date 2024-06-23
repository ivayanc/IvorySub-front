import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/UserPosts.css';
import { FaStar } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';
import { useGun } from '../utils/GunContext';

const users = {
    user1: { username: 'user1', info: 'Detailed info about user1', rating: 4.8 },
    user2: { username: 'user2', info: 'Detailed info about user2', rating: 4.5 },
    // Add more users as needed
};

const UserPage = () => {
    const { username } = useParams();
    const user = users[username];
    const gun = useGun();
    const postKeys = `posts-${username}`;

    const [posts, setPosts] = useState({}); // Store posts in an object
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionDate, setSubscriptionDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostText, setNewPostText] = useState('');

    useEffect(() => {
        if (gun) {
            const postsRef = gun.get(postKeys);
            postsRef.map().on((post, id) => {
                if (post) {
                    setPosts(prevPosts => ({ ...prevPosts, [id]: { ...post, id } }));
                } else {
                    // Handle deleted or undefined posts
                    setPosts(prevPosts => {
                        const updatedPosts = { ...prevPosts };
                        delete updatedPosts[id];
                        return updatedPosts;
                    });
                }
            });

            return () => postsRef.map().off();
        }
    }, [gun, postKeys]);

    const handleSubscribe = () => {
        setIsSubscribed(true);
        const currentDate = new Date();
        const subscriptionEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setSubscriptionDate(subscriptionEndDate);
    };

    const handleCancelSubscription = () => {
        setIsSubscribed(false);
        setSubscriptionDate(null);
    };

    const handleCreatePost = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewPostTitle('');
        setNewPostText('');
    };

    const handleSavePost = () => {
        if (newPostTitle && newPostText) {
            if (gun) {
                gun.get(postKeys).set({
                    title: newPostTitle,
                    description: newPostText,
                    timestamp: Date.now()
                });
            }
            handleCloseModal();
        }
    };

    // Convert the posts object to an array and sort by timestamp in descending order
    const postsArray = Object.values(posts).sort((a, b) => b.timestamp - a.timestamp);

    if (!user || postsArray.length === 0) {
        return <div className="user-page">User not found or no posts available</div>;
    }

    return (
        <div className="user-page">
            <div className="user-posts">
                {'user2' === username && <button className="create-post-button" onClick={handleCreatePost}>Create New Post</button>}
                {postsArray.map((post, index) => (
                    <div key={index} className="post-card">
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-text" dangerouslySetInnerHTML={{ __html: isSubscribed ? sanitizeHtml(post.description) : "Subscribe to view the full content." }} />
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Post</h2>
                        <div className="form-group">
                            <label htmlFor="post-title">Title</label>
                            <input
                                type="text"
                                id="post-title"
                                placeholder="Title"
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="post-text">Post Description</label>
                            <ReactQuill
                                value={newPostText}
                                onChange={setNewPostText}
                                className="modal-editor"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="submit-button" onClick={handleSavePost}>Save</button>
                            <button className="close-button" onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
