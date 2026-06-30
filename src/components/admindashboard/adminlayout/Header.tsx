import React from 'react';

type Props = {};

const Header = (props: Props) => {
  // Sidebar toggle function
  const toggleSb = () => {
    document.getElementById('sb')?.classList.toggle('collapsed');
  };

  return (
    <div>
      <div id="topbar" className='ml-60'>
        <button className="ham-btn"  title="Toggle sidebar">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="top-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search wallpapers, users..." />
        </div>
        <div className="top-right">
          <div className="notif" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="nbadge">6</div>
          </div>
          <div className="admin-pill">
            <div className="av">A</div>
            <div className="admin-info">
              <div className="admin-name">Admin</div>
              <div className="admin-role">Super Admin</div>
            </div>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ color: 'var(--text3)', marginLeft: '2px' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;