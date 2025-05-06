import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Home,
  Settings,
  Users,
  ListVideo,
  ChevronLeft,
  ChevronRight,
  Music,
  Calendar,
  UserRound,
  FileText,
  Book,
  Menu,
  Palette,
  Pill,
  Languages,
  Wallet
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

type UserRole = 'director' | 'educateur' | 'chef_groupe' | 'infirmier' | 'user' | 'normal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: UserRole[];
  badge?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const isMobile = useIsMobile();

  let navItems = [
    { name: t('navigation.dashboard'), icon: Home, path: '/dashboard', roles: ['director', 'educateur', 'chef_groupe', 'infirmier', 'user', 'normal', 'postman', 'animateur_general'] },
    { name: t('navigation.posts'), icon: FileText, path: '/posts', roles: ['director', 'educateur', 'chef_groupe', 'infirmier', 'user', 'normal', 'postman', 'animateur_general'] },
    { name: t('navigation.anachids'), icon: Music, path: '/anachids', roles: ['director', 'educateur', 'chef_groupe', 'infirmier', 'user', 'normal', 'postman', 'animateur_general'] },
    { name: t('navigation.programs'), icon: ListVideo, path: '/programs', roles: ['director', 'educateur', 'chef_groupe', 'infirmier', 'postman', 'animateur_general'] },
    { name: t('navigation.verifications'), icon: Users, path: '/verifications', roles: ['director'], badge: '!' },
    { name: t('navigation.cartesTechniques'), icon: FileText, path: '/cartes-techniques', roles: ['director', 'educateur', 'animateur_general'] },
    { name: t('navigation.phases'), icon: Calendar, path: '/phases', roles: ['director'] },
    { name: t('navigation.teams'), icon: UserRound, path: '/teams', roles: ['director', 'chef_groupe', 'animateur_general'] },
    { name: t('navigation.members'), icon: Users, path: '/members', roles: ['director'] },
    { name: t('navigation.children'), icon: User, path: '/enfants', roles: ['director', 'educateur', 'chef_groupe'] },
    { name: t('navigation.maladies'), icon: Pill, path: '/maladies', roles: ['director', 'infirmier','educateur'] },
    { name: t('navigation.hobbies'), icon: Book, path: '/hobbies', roles: ['educateur'] },
    { name: t('transactions.title'), icon: Wallet, path: '/transactions', roles: ['educateur'] },
    { name: t('navigation.profile'), icon: User, path: '/profile', roles: ['director', 'educateur', 'chef_groupe', 'infirmier', 'user', 'normal', 'postman', 'animateur_general'] }
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  const filteredNavItems = user && user.role ? navItems.filter(item => item.roles.includes(user.role as UserRole)) : [];

  // Get the profile picture URL based on user data
  const userProfilePicture = user?.profile_picture 
    ? `http://localhost:8000/storage/profiles/${user.profile_picture.replace(/^profiles\//, '')}`
    : '/placeholder.svg';

  return (
    <SidebarProvider>
      <div className={cn(
        "flex h-screen bg-background overflow-hidden dark:bg-darkpurple dark:text-white w-full",
        direction === 'rtl' ? "rtl" : "ltr"
      )}>
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}

        <div 
          className={cn(
            "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 fixed md:relative z-40 h-full",
            isSidebarCollapsed ? "w-16" : "w-64",
            isMobileSidebarOpen ? "left-0" : "-left-64 md:left-0",
            "dark:bg-darkpurple/95"
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            {!isSidebarCollapsed && (
              <Logo size="sm" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" collapsed={false} />
            )}
            {isSidebarCollapsed && (
              <Logo size="sm" className="mx-auto" collapsed={true} />
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:flex hidden"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-2">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <div 
                  key={item.name} 
                  className={cn(
                    "menu-item group relative",
                    window.location.pathname === item.path && "menu-item-active"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobileSidebarOpen) toggleMobileSidebar();
                  }}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {item.badge && !isSidebarCollapsed && (
                    <Badge variant="outline" className="ml-auto bg-accent/10 text-accent border-accent/20 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {isSidebarCollapsed && !isMobileSidebarOpen && (
                    <div className="absolute left-full ml-2 rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {item.name}
                      {item.badge && (
                        <Badge variant="outline" className="ml-1 bg-accent/10 text-accent border-accent/20 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <AvatarImage src={userProfilePicture} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="flex flex-col overflow-hidden">
                  <p className="font-medium text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-xs opacity-75 capitalize truncate">
                    {user?.role ? t(`roles.${user.role}`) : t('roles.normal')}
                  </p>
                </div>
              )}
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto h-7 w-7">
                      <Settings size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t('navigation.myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('navigation.profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('navigation.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isSidebarCollapsed && !isMobileSidebarOpen && (
              <div className="mt-3 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t('navigation.myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('navigation.profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('navigation.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-sidebar-accent/50 text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>{t('navigation.logout')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-card shadow-soft dark:shadow-none h-16 flex items-center px-4 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileSidebar}>
                <Menu size={20} />
              </Button>
              <h2 className="text-xl font-semibold text-foreground hidden sm:block">
                {user ? `${user.role ? t(`roles.${user.role}`) : t('roles.normal')} ${t('dashboard.dashboard')}` : t('dashboard.dashboard')}
              </h2>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
                {t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
            <div className="container mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
