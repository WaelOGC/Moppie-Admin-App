import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdWork,
  MdPayment,
  MdAnalytics,
  MdSettings,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
  MdList,
  MdSchedule,
  MdChevronLeft,
  MdChevronRight,
  MdPhotoCamera,
  MdNotifications,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileMenu } = useSidebar();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: MdDashboard,
      label: 'Dashboard'
    },
    { 
      name: 'Bookings', 
      href: '/bookings', 
      icon: MdCalendarToday,
      label: 'Bookings',
      subItems: [
        { name: 'List View', href: '/bookings', icon: MdList, label: 'List View' },
        { name: 'Calendar', href: '/bookings/calendar', icon: MdCalendarToday, label: 'Calendar' }
      ]
    },
    { 
      name: 'Staff', 
      href: '/staff', 
      icon: MdPeople,
      label: 'Staff',
      subItems: [
        { name: 'Directory', href: '/staff', icon: MdList, label: 'Directory' },
        { name: 'Schedule', href: '/staff/schedule', icon: MdSchedule, label: 'Schedule' }
      ]
    },
    { 
      name: 'Jobs', 
      href: '/jobs', 
      icon: MdWork,
      label: 'Jobs',
      subItems: [
        { name: 'List View', href: '/jobs', icon: MdList, label: 'List View' },
        { name: 'Calendar', href: '/jobs/calendar', icon: MdCalendarToday, label: 'Calendar' },
        { name: 'Media Review', href: '/jobs/media-review', icon: MdPhotoCamera, label: 'Media Review' }
      ]
    },
    { 
      name: 'Payments', 
      href: '/payments', 
      icon: MdPayment,
      label: 'Payments'
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: MdAnalytics,
      label: 'Analytics'
    },
    { 
      name: 'Notifications', 
      href: '/notifications', 
      icon: MdNotifications,
      label: 'Notifications'
    },
    { 
      name: 'Clients', 
      href: '/clients', 
      icon: MdPeople,
      label: 'Client CRM'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: MdSettings,
      label: 'Settings'
    },
  ];

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const isItemActive = (item) => {
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href) || 
             location.pathname === item.href;
    }
    return location.pathname === item.href;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-hidden'}`}
      >

        {/* Sidebar Navigation Menu */}
        <nav className="sidebar-menu">
          {navigationItems && navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const isExpanded = expandedItems[item.name];
            
            if (item.subItems) {
              return (
                <div key={item.name} className="menu-group">
                  <div
                    className={`menu-item ${isActive ? 'menu-item-active' : ''} ${isCollapsed ? 'menu-item-collapsed' : ''}`}
                    onClick={() => !isCollapsed && toggleExpanded(item.name)}
                    style={{ cursor: isCollapsed ? 'default' : 'pointer' }}
                  >
                    <Icon className="menu-item-icon" />
                    {!isCollapsed && (
                      <>
                        <span className="menu-item-label">{item.label}</span>
                        <div className="menu-item-expand">
                          {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {!isCollapsed && isExpanded && (
                    <div className="menu-submenu">
                      {item.subItems && item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.href;
                        
                        return (
                          <NavLink
                            key={subItem.name}
                            to={subItem.href}
                            className={`menu-item menu-subitem ${isSubActive ? 'menu-item-active' : ''}`}
                            onClick={closeMobileMenu}
                          >
                            <SubIcon className="menu-item-icon menu-subitem-icon" />
                            <span className="menu-item-label">{subItem.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`menu-item ${isActive ? 'menu-item-active' : ''} ${isCollapsed ? 'menu-item-collapsed' : ''}`}
                onClick={closeMobileMenu}
              >
                <Icon className="menu-item-icon" />
                {!isCollapsed && <span className="menu-item-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* User Profile */}
          <div className={`sidebar-user ${isCollapsed ? 'sidebar-user-collapsed' : ''}`}>
            <div className="sidebar-user-avatar">
              <span className="sidebar-user-avatar-text">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="sidebar-user-details">
                <p className="sidebar-user-name">
                  {user?.name || 'User'}
                </p>
                <p className="sidebar-user-role">
                  {user?.role || 'Admin'}
                </p>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          {!isCollapsed && (
            <button
              className="sidebar-theme-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          )}

          {/* Logout */}
          <button
            className={`menu-item menu-item-logout ${isCollapsed ? 'menu-item-collapsed' : ''}`}
            onClick={handleLogout}
            title="Logout"
          >
            <MdLogout className="menu-item-icon" />
            {!isCollapsed && <span className="menu-item-label">Logout</span>}
          </button>

          {/* Sidebar Toggle Button - Below Logout */}
          <button
            className="sidebar-toggle-button"
            onClick={handleToggleSidebar}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;