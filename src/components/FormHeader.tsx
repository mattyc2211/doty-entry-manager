import React from 'react';
import nzPremierLogo from '@/assets/nz-premier-logo.png';

const FormHeader = () => {
  return (
    <div className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={nzPremierLogo} 
              alt="NZ Premier Show Dog of the Year" 
              className="h-16 w-auto"
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
        </div>
      </div>
    </div>
  );
};

export default FormHeader;