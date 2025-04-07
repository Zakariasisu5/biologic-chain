
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Heart, 
  Bell, 
  LineChart, 
  Settings, 
  Shield,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  icon: React.ElementType;
  title: string;
  path: string;
  active?: boolean;
};

const NavItem = ({ icon: Icon, title, path, active }: NavItemProps) => (
  <Link to={path}>
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary/50'
      )}
    >
      <Icon size={20} />
      <span>{title}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const pathname = window.location.pathname;
  
  const navItems = [
    { icon: Home, title: 'Dashboard', path: '/' },
    { icon: Activity, title: 'Health Metrics', path: '/metrics' },
    { icon: Heart, title: 'Vitals', path: '/vitals' },
    { icon: LineChart, title: 'Trends', path: '/trends' },
    { icon: Bell, title: 'Alerts', path: '/alerts' },
    { icon: Shield, title: 'Blockchain', path: '/blockchain' },
    { icon: User, title: 'Profile', path: '/profile' },
    { icon: Settings, title: 'Settings', path: '/settings' }
  ];

  return (
    <div className="h-screen w-60 border-r bg-sidebar p-4">
      <div className="flex items-center gap-2 mb-10 px-3">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Heart size={18} className="text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">Aura Health</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.path} 
            {...item} 
            active={pathname === item.path} 
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
