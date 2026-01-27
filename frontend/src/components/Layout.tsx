import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isSuperAdmin = user?.role === 'super_admin';
  const isSchoolAdmin = user?.role === 'school_admin';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isStudent = user?.role === 'student';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['all'] },
    { path: '/schools', label: 'Schools', icon: '🏫', roles: ['super_admin'] },
    { path: '/students', label: 'Students', icon: '👨‍🎓', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/teachers', label: 'Teachers', icon: '👨‍🏫', roles: ['super_admin', 'school_admin'] },
    { path: '/parents', label: 'Parents', icon: '👨‍👩‍👧', roles: ['super_admin', 'school_admin'] },
    { path: '/attendance', label: 'Attendance', icon: '📝', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/exams', label: 'Exams', icon: '📚', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/fees', label: 'Fees', icon: '💰', roles: ['super_admin', 'school_admin'] },
    { path: '/communications', label: 'Communications', icon: '💬', roles: ['all'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.includes('all')) return true;
    return item.roles.some((role) => {
      if (role === 'super_admin') return isSuperAdmin;
      if (role === 'school_admin') return isSchoolAdmin;
      if (role === 'teacher') return isTeacher;
      if (role === 'parent') return isParent;
      if (role === 'student') return isStudent;
      return false;
    });
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>EasySchool</h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>EasySchool Management</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
