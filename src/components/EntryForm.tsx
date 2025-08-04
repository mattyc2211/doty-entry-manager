import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExhibitorDetails from './form-steps/ExhibitorDetails';
import DogEntries from './form-steps/DogEntries';
import CateringExtras from './form-steps/CateringExtras';
import ReviewSubmit from './form-steps/ReviewSubmit';
import FormHeader from './FormHeader';
import { FormData, ExhibitorData, DogEntry, CateringData } from '@/types/form';

const EntryForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    exhibitor: {
      firstName: '',
      surname: '',
      email: '',
      phone: ''
    },
    dogs: [],
    catering: {
      dinnerTickets: 0,
      extraCatalogues: 0
    }
  });

  const steps = [
    { number: 1, title: 'Exhibitor Details', component: ExhibitorDetails },
    { number: 2, title: 'Dog Entries', component: DogEntries },
    { number: 3, title: 'Catering & Extras', component: CateringExtras },
    { number: 4, title: 'Review & Submit', component: ReviewSubmit }
  ];

  const updateExhibitorData = (data: ExhibitorData) => {
    setFormData(prev => ({ ...prev, exhibitor: data }));
  };

  const updateDogData = (dogs: DogEntry[]) => {
    setFormData(prev => ({ ...prev, dogs }));
  };

  const updateCateringData = (data: CateringData) => {
    setFormData(prev => ({ ...prev, catering: data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const calculateTotal = () => {
    const eventCost = formData.dogs.reduce((total, dog) => {
      return total + (dog.events.length * 30);
    }, 0);
    const dinnerCost = formData.catering.dinnerTickets * 45;
    const catalogueCost = formData.catering.extraCatalogues * 10;
    return eventCost + dinnerCost + catalogueCost;
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {steps[currentStep - 1].title}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="flex justify-between mt-4">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`text-xs px-3 py-1 rounded-full transition-smooth ${
                      currentStep === step.number
                        ? 'bg-primary text-primary-foreground'
                        : currentStep > step.number
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.number}. {step.title}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <ExhibitorDetails
                  formData={formData}
                  updateExhibitorData={updateExhibitorData}
                  nextStep={nextStep}
                />
              )}
              
              {currentStep === 2 && (
                <DogEntries
                  formData={formData}
                  updateDogData={updateDogData}
                  nextStep={nextStep}
                />
              )}
              
              {currentStep === 3 && (
                <CateringExtras
                  formData={formData}
                  updateCateringData={updateCateringData}
                  calculateTotal={calculateTotal}
                  nextStep={nextStep}
                />
              )}
              
              {currentStep === 4 && (
                <ReviewSubmit
                  formData={formData}
                  calculateTotal={calculateTotal}
                />
              )}

              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < steps.length && (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EntryForm;