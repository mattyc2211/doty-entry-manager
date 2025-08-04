import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface FormHeaderProps {
  showBackToHome?: boolean;
  onBackToHome?: () => void;
}

const FormHeader = ({ showBackToHome = false, onBackToHome }: FormHeaderProps) => {
  return (
    <div className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/nz-premier-logo.png" 
              alt="NZ Premier Show Dog of the Year" 
              className="h-16 w-auto"
              loading="eager"
              onError={(e) => {
                console.error('Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="border-l border-primary-glow h-12 mx-4" />
            <div>
              <h1 className="text-2xl font-bold">
                NZ Premier Show Dog of the Year 2025
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Entry Form
              </p>
            </div>
          </div>
          
          {showBackToHome && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToHome}
              className="flex items-center gap-2 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;