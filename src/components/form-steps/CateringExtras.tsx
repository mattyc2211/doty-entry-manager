import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FormData, CateringData } from '@/types/form';
import { Utensils, Book, Calculator } from 'lucide-react';

interface CateringExtrasProps {
  formData: FormData;
  updateCateringData: (data: CateringData) => void;
  calculateTotal: () => number;
  nextStep: () => void;
  isCateringOnly?: boolean;
}

const CateringExtras = ({ 
  formData, 
  updateCateringData, 
  calculateTotal, 
  nextStep, 
  isCateringOnly = false 
}: CateringExtrasProps) => {
  const handleInputChange = (field: keyof CateringData, value: number | string) => {
    if (typeof value === 'number') {
      const newValue = Math.max(0, value);
      updateCateringData({
        ...formData.catering,
        [field]: newValue
      });
    } else {
      updateCateringData({
        ...formData.catering,
        [field]: value
      });
    }
  };

  // Calculate costs
  const eventCost = formData.dogs.reduce((total, dog) => {
    return total + (dog.events.length * 30);
  }, 0);
  
  const dinnerCost = formData.catering.dinnerTickets * 45;
  const catalogueCost = formData.catering.extraCatalogues * 10;
  const totalCost = eventCost + dinnerCost + catalogueCost;

  // For catering-only, require at least one item
  const canContinue = isCateringOnly 
    ? (formData.catering.dinnerTickets > 0 || formData.catering.extraCatalogues > 0)
    : true;

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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dinner Tickets */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Utensils className="w-5 h-5" />
              Catering
            </CardTitle>
            <p className="text-sm text-orange-700">
              Menu includes: Spit roast with an assortment of meats, jacket potato, salads and dessert
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium">Dinner Ticket</p>
                  <p className="text-sm text-muted-foreground">Per person</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  $45.00
                </Badge>
              </div>
              
              
              <div className="space-y-2">
                <Label htmlFor="dinnerTickets">Number of tickets</Label>
                <Input
                  id="dinnerTickets"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.catering.dinnerTickets}
                  onChange={(e) => handleInputChange('dinnerTickets', parseInt(e.target.value) || 0)}
                  className="bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dietaryRequirements">Dietary requirements (optional)</Label>
                <Textarea
                  id="dietaryRequirements"
                  placeholder="Please specify any dietary requirements or allergies..."
                  value={formData.catering.dietaryRequirements || ''}
                  onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                  className="bg-white"
                  rows={2}
                />
                <p className="text-xs text-orange-600">
                  Or email dietary requirements to: nzdoty@gmail.com
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold text-lg">${dinnerCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show Catalogues */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Book className="w-5 h-5" />
              Show Catalogues
            </CardTitle>
            <p className="text-sm text-blue-700">
              Additional copies of the official show catalogue
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium">Show Catalogue</p>
                  <p className="text-sm text-muted-foreground">
                    {!isCateringOnly ? 'Extra copies (1 included per handler)' : 'Per catalogue'}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  $10.00
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="extraCatalogues">
                  {isCateringOnly ? 'Number of catalogues' : 'Extra catalogues'}
                </Label>
                <Input
                  id="extraCatalogues"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.catering.extraCatalogues}
                  onChange={(e) => handleInputChange('extraCatalogues', parseInt(e.target.value) || 0)}
                  className="bg-white"
                />
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold text-lg">${catalogueCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calculator className="w-5 h-5" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!isCateringOnly && eventCost > 0 && (
              <div className="flex justify-between items-center">
                <span>Dog Events ({formData.dogs.reduce((sum, dog) => sum + dog.events.length, 0)} × $30.00)</span>
                <span className="font-medium">${eventCost.toFixed(2)}</span>
              </div>
            )}
            
            {dinnerCost > 0 && (
              <div className="flex justify-between items-center">
                <span>Dinner Tickets ({formData.catering.dinnerTickets} × $45.00)</span>
                <span className="font-medium">${dinnerCost.toFixed(2)}</span>
              </div>
            )}
            
            {catalogueCost > 0 && (
              <div className="flex justify-between items-center">
                <span>Extra Catalogues ({formData.catering.extraCatalogues} × $10.00)</span>
                <span className="font-medium">${catalogueCost.toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t border-green-300 pt-3">
              <div className="flex justify-between items-center text-lg font-bold text-green-900">
                <span>Total Amount Due:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {isCateringOnly && totalCost === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  Please select at least one item to continue with your order.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-center">Payment Information</h4>
            <div className="bg-muted p-3 rounded space-y-1 text-sm">
              <p><strong>Account Name:</strong> Premier Show Dog of the Year</p>
              <p><strong>Account Number:</strong> 12-3031-0250030-00</p>
              <p><strong>Reference:</strong> Use your surname</p>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Order will not be processed until payment is made
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CateringExtras;