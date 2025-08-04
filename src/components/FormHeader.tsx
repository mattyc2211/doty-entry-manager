import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
interface FormHeaderProps {
  showBackToHome?: boolean;
  onBackToHome?: () => void;
}
const FormHeader = ({
  showBackToHome = false,
  onBackToHome
}: FormHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return <div className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            
          </div>
          
          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive('/') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`} onClick={() => navigate('/')}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive('/entry') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`} onClick={() => navigate('/entry')}>
                  Entry Form
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive('/qualified-participants') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`} onClick={() => navigate('/qualified-participants')}>
                  Qualified Participants
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive('/about-show') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`} onClick={() => navigate('/about-show')}>
                  About Show
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Mobile Menu or Reset Button */}
          <div className="flex items-center">
            {showBackToHome && <Button variant="outline" size="sm" onClick={onBackToHome} className="flex items-center gap-2 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20">
                <Home className="w-4 h-4" />
                Reset
              </Button>}
          </div>
        </div>
      </div>
    </div>;
};
export default FormHeader;