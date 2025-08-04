import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, DollarSign, Award, Users, Camera, CreditCard } from 'lucide-react';
interface WelcomeStepProps {
  onSelectEntryType: (type: 'competition' | 'catering') => void;
}
const WelcomeStep = ({
  onSelectEntryType
}: WelcomeStepProps) => {
  return <div className="space-y-6">
      {/* Entry Type Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Competition Entry</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Enter your dog(s) in the competition with optional catering and catalogues
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Event Entry</Badge>
                <span className="text-sm text-muted-foreground">$30 each</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Show Catalogues</Badge>
                <span className="text-sm text-muted-foreground">Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Dinner Tickets</Badge>
                <span className="text-sm text-muted-foreground">$45 each (optional)</span>
              </div>
            </div>
            <Button onClick={() => onSelectEntryType('competition')} className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
              Start Competition Entry
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Catering & Catalogues Only</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Purchase dinner tickets and show catalogues without entering dogs
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Dinner Tickets</Badge>
                <span className="text-sm text-muted-foreground">$45 each</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Show Catalogues</Badge>
                <span className="text-sm text-muted-foreground">$10 each</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">No Competition</Badge>
                <span className="text-sm text-muted-foreground">Events only</span>
              </div>
            </div>
            <Button onClick={() => onSelectEntryType('catering')} className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
              Purchase Extras Only
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Important Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Photo Requirements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-blue-700">
                • High quality digital photos required
              </div>
              <div className="text-blue-700">
                • Clear side profile showing stance
              </div>
              <div className="text-blue-700">
                • No filters or heavy editing
              </div>
              <div className="text-blue-700">
                • Upload during dog registration
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg text-green-900">Payment Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-green-700">
                Payment via bank transfer after submission
              </div>
              <div className="text-green-700">
                Bank details provided in confirmation
              </div>
              <div className="text-green-700">
                Entry confirmed upon payment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Contact Information */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Contact our show secretary for assistance with entries or questions
            </p>
            <div className="flex justify-center text-sm">
              <span>📧 nzdoty@gmail.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default WelcomeStep;