import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebar } from '../../context/SidebarContext';

const Layout = () => {
  const { toggleMobileMenu, isCollapsed, isMobileOpen } = useSidebar();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-hidden'}`}>
        {/* Topbar */}
        <Topbar onMenuToggle={toggleMobileMenu} />

        {/* Page content */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
