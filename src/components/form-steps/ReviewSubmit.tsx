import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, User, Calendar, DollarSign, Send } from 'lucide-react';
import { FormData } from '@/types/form';
import { toast } from '@/hooks/use-toast';
interface ReviewSubmitProps {
  formData: FormData;
  calculateTotal: () => number;
  entryType: 'competition' | 'catering';
}
const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  formData,
  calculateTotal,
  entryType
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const {
    exhibitor,
    dogs,
    catering
  } = formData;
  const total = calculateTotal();
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const id = `NZ${Date.now().toString().slice(-6)}`;
      setSubmissionId(id);
      setSubmitted(true);
      toast({
        title: "Entry submitted successfully!",
        description: `Your submission ID is ${id}`
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (submitted) {
    return <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-primary">
              {entryType === 'catering' ? 'Order Confirmed!' : 'Submission Confirmed!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Submission ID</p>
              <p className="text-xl font-mono font-bold text-primary">{submissionId}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Amount Due</p>
              <p className="text-2xl font-bold text-primary">${total}</p>
            </div>

              <div className="space-y-2 text-sm">
              <h4 className="font-medium">Bank Transfer Details:</h4>
              <div className="bg-muted p-3 rounded space-y-1">
                <p><strong>Account Name:</strong> Premier Show Dog of the Year</p>
                <p><strong>Account Number:</strong> 12-3031-0250030-00</p>
                <p><strong>Reference:</strong> {exhibitor.surname}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Entry will not be accepted until payment is received
              </p>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              A confirmation email has been sent to {exhibitor.email}
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {entryType === 'catering' ? 'Review Your Order' : 'Review Your Submission'}
          </CardTitle>
          <p className="text-muted-foreground">
            {entryType === 'catering' ? 'Please review all details before submitting your order' : 'Please review all details before submitting your entry'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Exhibitor Details</h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2 ml-7">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{exhibitor.firstName} {exhibitor.surname}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{exhibitor.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{exhibitor.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dog Entries */}
      {entryType === 'competition' && <Card>
          <CardHeader>
            <CardTitle>Dog Entries ({dogs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dogs.map((dog, index) => <div key={dog.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge>Dog {index + 1}</Badge>
                  {dog.photoUrl && <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                      <img src={dog.photoUrl} alt={dog.pedigreeName} className="w-full h-full object-cover" />
                    </div>}
                  <h4 className="font-medium">{dog.pedigreeName}</h4>
                </div>
                
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">DogsNZ Registration</p>
                    <p>{dog.dogsNzRegistration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Breed</p>
                    <p>{dog.breed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Photo</p>
                    <p>{dog.photo ? '✓ Uploaded' : '✗ Missing'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Events Entered</p>
                  <div className="space-y-2">
                    {dog.events.map((event, i) => <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="font-medium">{event.eventType}</span>
                        <div className="text-sm text-muted-foreground">
                          {event.qualifyingShow} • {event.qualifyingDate}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>)}
          </CardContent>
        </Card>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Catering & Extras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Dinner tickets</span>
            <span>{catering.dinnerTickets} × $45 = ${catering.dinnerTickets * 45}</span>
          </div>
          <div className="flex justify-between">
            <span>Extra catalogues</span>
            <span>{catering.extraCatalogues} × $10 = ${catering.extraCatalogues * 10}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Total Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entryType === 'competition' && <div className="flex justify-between">
              <span>Dog entries ({dogs.reduce((total, dog) => total + dog.events.length, 0)} events)</span>
              <span>${dogs.reduce((total, dog) => total + dog.events.length, 0) * 30}</span>
            </div>}
          <div className="flex justify-between">
            <span>Dinner tickets</span>
            <span>${catering.dinnerTickets * 45}</span>
          </div>
          <div className="flex justify-between">
            <span>Extra catalogues</span>
            <span>${catering.extraCatalogues * 10}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold text-primary">
            <span>Total Amount Due</span>
            <span>${total}</span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="font-medium text-yellow-900 mb-2">⚠️ Payment Required</p>
            <p className="text-sm text-yellow-800">Your order will not be processed until payment is made via bank transfer.</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <h4 className="font-medium">Bank Transfer Details:</h4>
            <div className="bg-muted p-3 rounded space-y-1">
              <p><strong>Account Name:</strong> Premier Show Dog of the Year</p>
              <p><strong>Account Number:</strong> 12-3031-0250030-00</p>
              <p><strong>Reference:</strong> {exhibitor.surname}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="min-w-[200px] flex items-center gap-2">
          {isSubmitting ? <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              Submitting...
            </> : <>
              <Send className="w-4 h-4" />
              {entryType === 'catering' ? 'Submit Order' : 'Submit Entry'}
            </>}
        </Button>
      </div>
    </div>;
};
export default ReviewSubmit;