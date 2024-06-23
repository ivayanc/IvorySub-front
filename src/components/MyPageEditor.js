import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import '../styles/MyPageEditor.css';
import { useAccount } from '../utils/AccountContext';
import { useGun } from '../utils/GunContext';

const MyPageEditor = () => {
    const { account, creatorUsername, creatorDesc, setCreatorUsername, setCreatorDesc } = useAccount();
    const gun = useGun();
    const [userName, setUserName] = useState(creatorUsername || 'defaultUser');
    const [initialUserName, setInitialUserName] = useState(creatorUsername || 'defaultUser');
    const [shortDescription, setShortDescription] = useState(creatorDesc || 'This is a hardcoded short description.');
    const [initialShortDescription, setInitialShortDescription] = useState(creatorDesc || 'This is a hardcoded short description.');
    const [tiers, setTiers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentTier, setCurrentTier] = useState({ id: '', name: '', price: '', description: '' });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationAction, setConfirmationAction] = useState(null);

    useEffect(() => {
        setIsSaveEnabled(userName !== initialUserName || shortDescription !== initialShortDescription);
    }, [userName, shortDescription, initialUserName, initialShortDescription]);

    useEffect(() => {
        if (gun && account) {
            const tiersRef = gun.get(`tiers-${account}`);
            tiersRef.map().on((tier, id) => {
                if (tier) {
                    setTiers(prevTiers => {
                        if (prevTiers.some(t => t.id === id)) {
                            return prevTiers.map(t => (t.id === id ? { ...tier, id } : t));
                        } else {
                            return [...prevTiers, { ...tier, id }];
                        }
                    });
                } else {
                    setTiers(prevTiers => prevTiers.filter(t => t.id !== id));
                }
            });

            return () => tiersRef.map().off();
        }
    }, [gun, account]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUserName(value);
        if (name === 'shortDescription') setShortDescription(value);
    };

    const handleSaveUserInfo = () => {
        setConfirmationMessage('Are you sure you want to save changes?');
        setConfirmationAction(() => () => {
            setCreatorUsername(userName);
            setCreatorDesc(shortDescription);
            if (gun) {
                gun.get('users').get(account).put({ 
                    isCreator: true, 
                    username: userName,
                    shortInfo: shortDescription 
                });
                gun.get('username-account').get(userName).put({ 
                    account: account
                });
            }
            setInitialUserName(userName);
            setInitialShortDescription(shortDescription);
            setIsConfirmationOpen(false);
        });
        setIsConfirmationOpen(true);
    };

    const handleOpenModal = (type, tier = { id: '', name: '', price: '', description: '' }) => {
        setModalType(type);
        setCurrentTier(tier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTier({ id: '', name: '', price: '', description: '' });
    };

    const handleSaveTier = () => {
        setConfirmationMessage(modalType === 'edit' ? 'Are you sure you want to save changes?' : 'Are you sure you want to create this tier?');
        setConfirmationAction(() => () => {
            if (gun && account) {
                const tiersRef = gun.get(`tiers-${account}`);
                if (modalType === 'edit') {
                    setTiers(prevTiers => prevTiers.map(tier => (tier.id === currentTier.id ? currentTier : tier)));
                    tiersRef.get(currentTier.id).put(currentTier);
                } else {
                    const newTierId = new Date().getTime().toString();
                    const newTier = { ...currentTier, id: newTierId };
                    setTiers(prevTiers => [...prevTiers, newTier]);
                    tiersRef.get(newTierId).put(newTier);
                }
            }
            handleCloseModal();
            setIsConfirmationOpen(false);
        });
        setIsConfirmationOpen(true);
    };

    const handleDeleteTier = (id) => {
        setConfirmationMessage('Are you sure you want to delete this tier?');
        setConfirmationAction(() => () => {
            if (gun && account) {
                const tiersRef = gun.get(`tiers-${account}`);
                setTiers(prevTiers => prevTiers.filter(tier => tier.id !== id));
                tiersRef.get(id).put(null);
            }
            setIsConfirmationOpen(false);
        });
        setIsConfirmationOpen(true);
    };

    return (
        <div className="page-editor">
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={userName}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="shortDescription">Short Description:</label>
                <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    value={shortDescription}
                    readOnly
                />
            </div>
            <button 
                onClick={handleSaveUserInfo} 
                disabled={!isSaveEnabled} 
                className="save-button"
            >
                Save
            </button>

            <h2>Subscription Tiers</h2>
            <button onClick={() => handleOpenModal('create')}>Create New Tier</button>
            <div className="tiers-table">
                {tiers.map((tier) => (
                    <div key={tier.id} className="tier-card">
                        <div className="tier-header">
                            <h3>{tier.name}</h3> - <i>${tier.price}</i>
                        </div>
                        <p>{tier.description}</p>
                        <div className="tier-card-buttons">
                            <button onClick={() => handleOpenModal('edit', tier)}>Edit</button>
                            <button onClick={() => handleDeleteTier(tier.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-t">
                        <h2>{modalType === 'edit' ? 'Edit Tier' : 'Create New Tier'}</h2>
                        <div className="form-group-t">
                            <label htmlFor="tierName">Name:</label>
                            <input
                                type="text"
                                id="tierName"
                                name="name"
                                value={currentTier.name}
                                onChange={(e) => setCurrentTier({ ...currentTier, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group-t">
                            <label htmlFor="tierPrice">Price:</label>
                            <input
                                type="number"
                                id="tierPrice"
                                name="price"
                                value={currentTier.price}
                                onChange={(e) => setCurrentTier({ ...currentTier, price: e.target.value })}
                            />
                        </div>
                        <div className="form-group-t">
                            <label htmlFor="tierDescription">Description:</label>
                            <textarea
                                id="tierDescription"
                                name="description"
                                value={currentTier.description}
                                onChange={(e) => setCurrentTier({ ...currentTier, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleSaveTier}>Save</button>
                            <button onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmationOpen}
                message={confirmationMessage}
                onConfirm={confirmationAction}
                onCancel={() => setIsConfirmationOpen(false)}
            />
        </div>
    );
};

export default MyPageEditor;
