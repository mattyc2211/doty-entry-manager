import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Utensils, BookOpen, Info } from 'lucide-react';
import { CateringData, FormData } from '@/types/form';

interface CateringExtrasProps {
  formData: FormData;
  updateCateringData: (data: CateringData) => void;
  calculateTotal: () => number;
  nextStep: () => void;
  isCateringOnly?: boolean;
}

const CateringExtras: React.FC<CateringExtrasProps> = ({
  formData,
  updateCateringData,
  calculateTotal,
  nextStep
}) => {
  const { catering, dogs } = formData;

  const handleInputChange = (field: keyof CateringData, value: number) => {
    updateCateringData({
      ...catering,
      [field]: Math.max(0, value)
    });
  };

  const eventCount = dogs.reduce((total, dog) => total + dog.events.length, 0);
  const eventCost = eventCount * 30;
  const dinnerCost = catering.dinnerTickets * 45;
  const catalogueCost = catering.extraCatalogues * 10;

  const canContinue = () => {
    return eventCount > 0 || catering.dinnerTickets > 0 || catering.extraCatalogues > 0;
  };

  return (
    <div className="space-y-6">
      {isCateringOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Catering & Catalogues Only</h3>
          <p className="text-sm text-blue-700">
            You've selected to purchase catering and catalogues without entering dogs in the competition. 
            Please select at least one item below to continue.
          </p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Dinner Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Awards Dinner</p>
              <p className="text-sm text-muted-foreground">
                Join us for the awards presentation dinner
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              $45 each
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="dinnerTickets">Number of tickets:</Label>
            <Input
              id="dinnerTickets"
              type="number"
              min="0"
              max="20"
              value={catering.dinnerTickets}
              onChange={(e) => handleInputChange('dinnerTickets', parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              Total: ${dinnerCost}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Extra Catalogues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              One catalogue is included free with your entry
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Official Show Catalogue</p>
              <p className="text-sm text-muted-foreground">
                Additional copies of the event programme
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              $10 each
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="extraCatalogues">Extra catalogues:</Label>
            <Input
              id="extraCatalogues"
              type="number"
              min="0"
              max="10"
              value={catering.extraCatalogues}
              onChange={(e) => handleInputChange('extraCatalogues', parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              Total: ${catalogueCost}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Dog entries ({eventCount} events)</span>
            <span className="font-medium">${eventCost}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Dinner tickets ({catering.dinnerTickets})</span>
            <span className="font-medium">${dinnerCost}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Extra catalogues ({catering.extraCatalogues})</span>
            <span className="font-medium">${catalogueCost}</span>
          </div>
          <div className="border-t border-primary/20 pt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount Due</span>
              <span className="text-primary">${calculateTotal()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!canContinue()}
          className="min-w-[120px]"
        >
          Review Submission
        </Button>
      </div>
    </div>
  );
};

export default CateringExtras;