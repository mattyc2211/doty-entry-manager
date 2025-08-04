import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Home, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };
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
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive('/sponsors') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground border-white/20`} onClick={() => navigate('/sponsors')}>
                  Sponsors
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Mobile Menu or Reset Button */}
          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="md:hidden bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-primary-foreground border-white/20">
                <SheetHeader>
                  <SheetTitle className="text-primary-foreground">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Button 
                    variant="ghost" 
                    className={`justify-start ${isActive('/') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground`}
                    onClick={() => handleNavigation('/')}
                  >
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`justify-start ${isActive('/entry') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground`}
                    onClick={() => handleNavigation('/entry')}
                  >
                    Entry Form
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`justify-start ${isActive('/qualified-participants') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground`}
                    onClick={() => handleNavigation('/qualified-participants')}
                  >
                    Qualified Participants
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`justify-start ${isActive('/about-show') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground`}
                    onClick={() => handleNavigation('/about-show')}
                  >
                    About Show
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`justify-start ${isActive('/sponsors') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-primary-foreground`}
                    onClick={() => handleNavigation('/sponsors')}
                  >
                    Sponsors
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

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