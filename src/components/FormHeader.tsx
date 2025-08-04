import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
interface FormHeaderProps {
  showBackToHome?: boolean;
  onBackToHome?: () => void;
}
const FormHeader = ({
  showBackToHome = false,
  onBackToHome
}: FormHeaderProps) => {
  return <div className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo Banner */}
          <div className="flex items-center justify-center w-full">
            <img src="/lovable-uploads/5f3a049a-ea83-488a-82c1-3554b63b2466.png" alt="NZ Premier Show Dog of the Year 2025" className="h-24 md:h-32 w-auto max-w-full" loading="eager" onError={e => {
            console.error('Logo failed to load');
            e.currentTarget.style.display = 'none';
          }} />
          </div>
          
          {/* Entry Form subtitle and Back button */}
          <div className="flex items-center justify-between w-full">
            
            
            {showBackToHome && <Button variant="outline" size="sm" onClick={onBackToHome} className="flex items-center gap-2 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>}
          </div>
        </div>
      </div>
    </div>;
};
export default FormHeader;