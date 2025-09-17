import React, { useState } from 'react';
import { MdMenu, MdSearch, MdPerson } from 'react-icons/md';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import NotificationsDropdown from '../common/NotificationsDropdown';

const Topbar = ({ onMenuToggle }) => {
  // eslint-disable-next-line no-empty-pattern
  const { } = useNotifications();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    await logout();
  };


  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
        >
          <MdMenu className="topbar-btn-icon" />
        </button>

        {/* Search */}
        <div className="topbar-center">
          <div className={`search-bar ${searchFocused ? 'search-bar-focused' : ''}`}>
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search bookings, clients, jobs..."
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="topbar-right">
          {/* Theme toggle */}
          <button
            className="topbar-btn theme-toggle-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Profile dropdown */}
          <div className="profile-dropdown">
            <button className="profile-btn" onClick={handleLogout}>
              <div className="profile-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'User'}</span>
                <span className="profile-role">{user?.role || 'Admin'}</span>
              </div>
              <MdPerson className="topbar-btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
