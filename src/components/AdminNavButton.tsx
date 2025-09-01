import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNavButton = () => {
  return (
    <Link to="/admin">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
      >
        <Shield className="w-4 h-4" />
        Admin
      </Button>
    </Link>
  );
};

export default AdminNavButton;