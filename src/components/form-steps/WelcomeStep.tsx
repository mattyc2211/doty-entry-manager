import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, DollarSign, Award, Users, Camera, CreditCard } from 'lucide-react';

interface WelcomeStepProps {
  onSelectEntryType: (type: 'competition' | 'catering') => void;
}

const WelcomeStep = ({ onSelectEntryType }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            Welcome to NZ Premier Show Dog of the Year 2025
          </CardTitle>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join New Zealand's most prestigious dog show competition. Showcase your dog's excellence 
            and compete for the ultimate title of Show Dog of the Year.
          </p>
        </CardHeader>
      </Card>

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
                <Badge variant="outline">Dog Registration</Badge>
                <span className="text-sm text-muted-foreground">Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Event Entry</Badge>
                <span className="text-sm text-muted-foreground">$30 per event</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Optional Extras</Badge>
                <span className="text-sm text-muted-foreground">Dinner & catalogues</span>
              </div>
            </div>
            <Button 
              onClick={() => onSelectEntryType('competition')}
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
              variant="outline"
            >
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
                <Badge variant="outline">No Dog Entry</Badge>
                <span className="text-sm text-muted-foreground">Skip registration</span>
              </div>
            </div>
            <Button 
              onClick={() => onSelectEntryType('catering')}
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
              variant="outline"
            >
              Purchase Extras Only
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Important Information */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-900">Important Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Entries Close:</span>
                <span className="font-medium text-orange-900">March 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Show Date:</span>
                <span className="font-medium text-orange-900">April 5-6, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Late Entries:</span>
                <span className="font-medium text-orange-900">+$10 fee</span>
              </div>
            </div>
          </CardContent>
        </Card>

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

      {/* Rules Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Key Rules & Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-base mb-2">Competition Rules</h4>
              <p>• Dogs must be registered with recognized kennel club</p>
              <p>• Maximum 8 dogs per exhibitor</p>
              <p>• No duplicate entries (same dog, same event)</p>
              <p>• Professional handling allowed</p>
              <p>• Grooming tools and setup provided</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-base mb-2">What's Included</h4>
              <p>• Competition entry and judging</p>
              <p>• Show catalogue (1 per dog entry)</p>
              <p>• Certificate for all participants</p>
              <p>• Professional photography of winners</p>
              <p>• Access to grooming and warm-up areas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Contact our show secretary for assistance with entries or questions
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📧 secretary@nzpremiershow.com</span>
              <span className="hidden sm:inline">•</span>
              <span>📞 (09) 123-4567</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;