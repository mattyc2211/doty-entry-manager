import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExhibitorDetails from './form-steps/ExhibitorDetails';
import DogEntries from './form-steps/DogEntries';
import CateringExtras from './form-steps/CateringExtras';
import ReviewSubmit from './form-steps/ReviewSubmit';
import WelcomeStep from './form-steps/WelcomeStep';
import FormHeader from './FormHeader';
import { FormData, ExhibitorData, DogEntry, CateringData } from '@/types/form';

const EntryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [entryType, setEntryType] = useState<'competition' | 'catering' | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
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

  const getSteps = () => {
    if (entryType === 'catering') {
      return [
        { number: 0, title: 'Welcome', component: WelcomeStep },
        { number: 1, title: 'Exhibitor Details', component: ExhibitorDetails },
        { number: 2, title: 'Catering & Extras', component: CateringExtras },
        { number: 3, title: 'Review & Submit', component: ReviewSubmit }
      ];
    }
    return [
      { number: 0, title: 'Welcome', component: WelcomeStep },
      { number: 1, title: 'Exhibitor Details', component: ExhibitorDetails },
      { number: 2, title: 'Dog Entries', component: DogEntries },
      { number: 3, title: 'Catering & Extras', component: CateringExtras },
      { number: 4, title: 'Review & Submit', component: ReviewSubmit }
    ];
  };

  const steps = getSteps();

  const updateExhibitorData = (data: ExhibitorData) => {
    setFormData(prev => ({ ...prev, exhibitor: data }));
  };

  const updateDogData = (dogs: DogEntry[]) => {
    setFormData(prev => ({ ...prev, dogs }));
  };

  const updateCateringData = (data: CateringData) => {
    setFormData(prev => ({ ...prev, catering: data }));
  };

  const handleEntryTypeSelection = (type: 'competition' | 'catering') => {
    setEntryType(type);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step === 0 || entryType) {
      setCurrentStep(step);
    }
  };

  const calculateTotal = () => {
    const eventCost = formData.dogs.reduce((total, dog) => {
      return total + (dog.events.length * 30);
    }, 0);
    const dinnerCost = formData.catering.dinnerTickets * 45;
    const catalogueCost = formData.catering.extraCatalogues * 10;
    return eventCost + dinnerCost + catalogueCost;
  };

  const handleBackToHome = () => {
    if (currentStep > 0) {
      setShowResetDialog(true);
    }
  };

  const confirmReset = () => {
    setCurrentStep(0);
    setEntryType(null);
    setFormData({
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
    setShowResetDialog(false);
  };

  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader 
        showBackToHome={currentStep > 0}
        onBackToHome={handleBackToHome}
      />
      
      {/* Add padding top to account for fixed header with navigation */}
      <div className="pt-40 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 ? (
            <WelcomeStep onSelectEntryType={handleEntryTypeSelection} />
          ) : (
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {steps[currentStep].title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {steps.length - 1}
                    {entryType === 'catering' && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Catering Only
                      </span>
                    )}
                  </div>
                </div>
                
                {currentStep > 0 && (
                  <>
                    <Progress value={progress} className="w-full" />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {steps.filter(s => s.number > 0).map((step) => (
                        <button
                          key={step.number}
                          onClick={() => goToStep(step.number)}
                          disabled={step.number === 0}
                          className={`text-xs px-3 py-1 rounded-full transition-smooth ${
                            currentStep === step.number
                              ? 'bg-primary text-primary-foreground'
                              : currentStep > step.number
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step.number}. {step.title}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <ExhibitorDetails
                    formData={formData}
                    updateExhibitorData={updateExhibitorData}
                    nextStep={nextStep}
                  />
                )}
                
                {currentStep === 2 && entryType === 'competition' && (
                  <DogEntries
                    formData={formData}
                    updateDogData={updateDogData}
                    nextStep={nextStep}
                  />
                )}
                
                {((currentStep === 3 && entryType === 'competition') || (currentStep === 2 && entryType === 'catering')) && (
                  <CateringExtras
                    formData={formData}
                    updateCateringData={updateCateringData}
                    calculateTotal={calculateTotal}
                    nextStep={nextStep}
                    isCateringOnly={entryType === 'catering'}
                  />
                )}
                
                {((currentStep === 4 && entryType === 'competition') || (currentStep === 3 && entryType === 'catering')) && (
                  <ReviewSubmit
                    formData={formData}
                    calculateTotal={calculateTotal}
                    entryType={entryType || 'competition'}
                  />
                )}

                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep <= 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 && (
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
          )}
        </div>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return to Home?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your entered information and return you to the welcome page. 
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Yes, go to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EntryForm;