import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import UsersPage from './components/UserPage';
import UserPosts from './components/UserPosts';
import MySubscriptionsPage from './components/MySubscriptionsPage';
import MyPageEditor from './components/MyPageEditor';
import { GunProvider } from './utils/GunContext';
import { AccountProvider } from './utils/AccountContext';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuthorization = (status) => {
    setIsAuthorized(status);
  };

  return (
    <GunProvider peers={['http://localhost:8765/gun']}>
      <AccountProvider>
        <Router>
          <Header
            isAuthorized={isAuthorized}
            onAuthorize={handleAuthorization}
          />
          <div className="app-content">
            <Routes>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/user/:username" element={<UserPosts />} />
              <Route path="/settings" element={<MyPageEditor />} />
              <Route path="/subscriptions" element={<MySubscriptionsPage />} />
            </Routes>
          </div>
        </Router>
      </AccountProvider>
    </GunProvider>
  );
}

export default App;
