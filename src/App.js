import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import UsersPage from './components/UserPage';
import UserPosts from './components/UserPosts';
import MySubscriptionsPage from './components/MySubscriptionsPage';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState('');

  const handleAuthorization = (status, creatorStatus, username) => {
      setIsAuthorized(status);
      setIsCreator(creatorStatus);
      setCreatorUsername(username);
  };

  return (
      <Router>
          <Header 
              isAuthorized={isAuthorized} 
              isCreator={isCreator} 
              creatorUsername={creatorUsername} 
              onAuthorize={handleAuthorization} 
          />
          <div className="app-content">
                <Routes>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/user/:username" element={<UserPosts />} />
                    <Route path="/subscriptions" element={<MySubscriptionsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;