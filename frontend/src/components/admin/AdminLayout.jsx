import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiGrid, FiFolder, FiCode, FiBriefcase, FiAward, FiBookOpen,
  FiMail, FiUser, FiSettings, FiLogOut, FiHome,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { to: '/admin', icon: FiGrid, label: 'Overview', end: true },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { to: '/admin/skills', icon: FiCode, label: 'Skills' },
  { to: '/admin/experience', icon: FiBriefcase, label: 'Experience' },
  { to: '/admin/achievements', icon: FiAward, label: 'Achievements' },
  { to: '/admin/certifications', icon: FiBookOpen, label: 'Certifications' },
  { to: '/admin/messages', icon: FiMail, label: 'Messages' },
  { to: '/admin/content', icon: FiUser, label: 'Site content' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <span className="font-display font-semibold text-lg">Admin</span>
          <p className="text-xs text-light-accent/50 mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-light-accent/70 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              <item.icon /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06] space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-light-accent/70 hover:bg-white/[0.04] hover:text-white">
            <FiHome /> View site
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-light-accent/70 hover:bg-white/[0.04] hover:text-white">
            <FiLogOut /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
