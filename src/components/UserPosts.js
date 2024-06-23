import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/UserPosts.css';
import { FaStar } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';
import { useGun } from '../utils/GunContext';
import { useAccount } from '../utils/AccountContext';
import { BrowserProvider, parseEther, toBeHex, toBigInt } from 'ethers';

const generateRandomSymbols = (length) => {
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return result;
};

const UserPage = () => {
    const { username } = useParams();
    const gun = useGun();
    const postKeys = `posts-${username}`;

    const { creatorUsername } = useAccount();
    const [posts, setPosts] = useState({});
    const [subscriptionPlans, setSubscriptionPlans] = useState({});
    const [profileAccount, setProfileAccount] = useState(null);
    const [creatorAccount, setCreatorAccount] = useState({});
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionDate, setSubscriptionDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostText, setNewPostText] = useState('');
    const [selectedTiers, setSelectedTiers] = useState([]);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    useEffect(() => {
        if (gun) {
            const userRef = gun.get('username-account').get(username);
            userRef.map().once((data) => {
                setProfileAccount(data);
            });

            if (profileAccount) {
                gun.get('users').get(profileAccount).once((data) => {
                    setCreatorAccount(data);
                });

                const tiersRef = gun.get(`tiers-${profileAccount}`);
                tiersRef.map().on((tier, id) => {
                    if (tier) {
                        setSubscriptionPlans((prevPlans) => ({ ...prevPlans, [id]: { ...tier, id } }));
                    }
                });

                const postsRef = gun.get(postKeys);
                postsRef.map().on((post, id) => {
                    if (post) {
                        setPosts((prevPosts) => ({ ...prevPosts, [id]: { ...post, id } }));
                    } else {
                        setPosts((prevPosts) => {
                            const updatedPosts = { ...prevPosts };
                            delete updatedPosts[id];
                            return updatedPosts;
                        });
                    }
                });

                return () => {
                    postsRef.map().off();
                    tiersRef.map().off();
                };
            }
        }
    }, [gun, username, profileAccount, postKeys]);

    const handleSubscribe = () => {
        setIsSubscribed(true);
        const currentDate = new Date();
        const subscriptionEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setSubscriptionDate(subscriptionEndDate);
        setShowSubscriptionModal(false);
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
        setSelectedTiers([]);
    };

    const handleSavePost = () => {
        if (newPostTitle && newPostText) {
            if (gun) {
                gun.get(postKeys).set({
                    title: newPostTitle,
                    description: newPostText,
                    timestamp: Date.now(),
                    tiers: selectedTiers.join(', ')
                });
            }
            handleCloseModal();
        }
    };

    const handleShowSubscriptionModal = () => {
        setShowSubscriptionModal(true);
    };

    const handleCloseSubscriptionModal = () => {
        setShowSubscriptionModal(false);
    };

    const handleTierChange = (tier) => {
        setSelectedTiers((prevTiers) =>
            prevTiers.includes(tier) ? prevTiers.filter((t) => t !== tier) : [...prevTiers, tier]
        );
    };

    // Convert the posts object to an array and sort by timestamp in descending order
    const postsArray = Object.values(posts).sort((a, b) => b.timestamp - a.timestamp);

    if (!creatorAccount) {
        return <div className="user-page">User not found</div>;
    }

    return (
        <div className="user-page">
            <div className="user-posts">
                {creatorUsername === username && (
                    <button className="create-post-button" onClick={handleCreatePost}>
                        Create New Post
                    </button>
                )}
                {postsArray.map((post, index) => (
                    <div key={index} className="post-card">
                        <div className="post-tier-tag">{post.tiers}</div>
                        <h3 className="post-title">{post.title}</h3>
                        <div className={`post-text ${!isSubscribed ? 'blur-text' : ''}`}>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: isSubscribed
                                        ? sanitizeHtml(post.description)
                                        : generateRandomSymbols(post.description.length)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="user-info">
                <div className="user-header">
                    <h2 className="user-name">{creatorAccount.username}</h2>
                </div>
                <p className="user-details">{creatorAccount.shortInfo}</p>
                {isSubscribed ? (
                    <div className="subscription-info">
                        Subscription will be updated at {subscriptionDate.toLocaleDateString()}
                        <button className="cancel-button" onClick={handleCancelSubscription}>
                            Cancel Subscription
                        </button>
                    </div>
                ) : (
                    <button className="wallet-button" onClick={handleShowSubscriptionModal}>
                        Subscribe
                    </button>
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
                        <div className="form-group choose-subscription-tier">
                            <label>Choose Subscription Tiers for This Post</label>
                            <div className="subscription-tier-options">
                                {Object.values(subscriptionPlans).map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`tier-option ${
                                            selectedTiers.includes(plan.name) ? 'selected' : ''
                                        }`}
                                        onClick={() => handleTierChange(plan.name)}
                                    >
                                        <div className="tier-info">
                                            <strong>{plan.name}</strong> - ${plan.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button className="submit-button" onClick={handleSavePost}>
                                Save
                            </button>
                            <button className="close-button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSubscriptionModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Choose Subscription Tier</h2>
                        <p>Select the subscription tier to access exclusive content.</p>
                        <div className="subscription-options">
                            {Object.values(subscriptionPlans).map((plan) => (
                                <button
                                    key={plan.id}
                                    className="subscription-button"
                                    onClick={() => handleSubscribe(plan)}
                                >
                                    <div className="subscription-plan">
                                        <strong>{plan.name}</strong> - ${plan.price}
                                        <p>{plan.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button className="close-button" onClick={handleCloseSubscriptionModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
