import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone } from 'lucide-react';
import { ExhibitorData, FormData } from '@/types/form';

interface ExhibitorDetailsProps {
  formData: FormData;
  updateExhibitorData: (data: ExhibitorData) => void;
  nextStep: () => void;
}

const ExhibitorDetails: React.FC<ExhibitorDetailsProps> = ({
  formData,
  updateExhibitorData,
  nextStep
}) => {
  const { exhibitor } = formData;

  const handleInputChange = (field: keyof ExhibitorData, value: string) => {
    updateExhibitorData({
      ...exhibitor,
      [field]: value
    });
  };

  const isValid = () => {
    return exhibitor.firstName.trim() && 
           exhibitor.surname.trim() && 
           exhibitor.email.trim() && 
           exhibitor.phone.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Exhibitor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={exhibitor.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Surname *</Label>
            <Input
              id="surname"
              value={exhibitor.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              placeholder="Enter your surname"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={exhibitor.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={exhibitor.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="021 123 4567"
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

    </form>
  );
};

export default ExhibitorDetails;