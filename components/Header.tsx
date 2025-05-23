'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname?.startsWith(path));
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-3 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="flex items-center">
              {/* NHL-like shield logo */}
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold mr-2 sm:mr-3">
                NHL
              </div>
              <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                PLAYOFF <span className="text-yellow-300">POOL</span>
              </Link>
            </div>
          </div>
          
          <nav className="flex space-x-1 items-center bg-blue-800 bg-opacity-50 rounded-full px-1 py-1 w-full sm:w-auto justify-center sm:justify-start">
            <NavLink href="/" active={isActive('/')}>
              Leaderboard
            </NavLink>
            <NavLink href="/teams" active={isActive('/teams')}>
              Teams
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, active, children }) => {
  return (
    <Link 
      href={href} 
      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
        active 
          ? 'bg-white text-blue-900' 
          : 'text-white hover:bg-blue-700'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header; 