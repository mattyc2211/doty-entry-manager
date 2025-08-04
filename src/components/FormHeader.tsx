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
  
  return (
    <div className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Banner */}
          <div className="flex items-center justify-center w-full">
            <img 
              src="/lovable-uploads/5f3a049a-ea83-488a-82c1-3554b63b2466.png" 
              alt="NZ Premier Show Dog of the Year 2025" 
              className="h-24 md:h-32 w-auto max-w-full cursor-pointer" 
              loading="eager" 
              onClick={() => navigate('/')}
              onError={e => {
                console.error('Logo failed to load');
                e.currentTarget.style.display = 'none';
              }} 
            />
          </div>
          
          {/* Navigation Menu */}
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="flex-wrap justify-center gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} ${isActive('/') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`}
                  onClick={() => navigate('/')}
                >
                  Entry Form
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} ${isActive('/about') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`}
                  onClick={() => navigate('/about')}
                >
                  About Show
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} ${isActive('/judges') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`}
                  onClick={() => navigate('/judges')}
                >
                  Meet Judges
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} ${isActive('/winners') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`}
                  onClick={() => navigate('/winners')}
                >
                  Past Winners
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} ${isActive('/qualified') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`}
                  onClick={() => navigate('/qualified')}
                >
                  Qualified
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Back to Home button (only shown on entry form) */}
          {showBackToHome && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackToHome} 
              className="flex items-center gap-2 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 mt-2"
            >
              <Home className="w-4 h-4" />
              Reset Form
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;