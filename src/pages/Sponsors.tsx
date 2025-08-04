import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormHeader from '@/components/FormHeader';
import { Construction } from 'lucide-react';

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Sponsors</h1>
            <p className="text-xl text-muted-foreground">Our valued partners and supporters</p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-primary">
                <Construction className="w-6 h-6" />
                Under Construction
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                This section is currently under construction and will be available soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;