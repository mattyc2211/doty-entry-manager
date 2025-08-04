import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import DogEntryForm from '@/components/DogEntryForm';
import { DogEntry, FormData } from '@/types/form';
import { toast } from '@/hooks/use-toast';

interface DogEntriesProps {
  formData: FormData;
  updateDogData: (dogs: DogEntry[]) => void;
  nextStep: () => void;
}

const DogEntries: React.FC<DogEntriesProps> = ({
  formData,
  updateDogData,
  nextStep
}) => {
  const { dogs } = formData;
  const [expandedDog, setExpandedDog] = useState<string | null>(
    dogs.length === 0 ? 'new' : null
  );

  const addNewDog = () => {
    const newDog: DogEntry = {
      id: Date.now().toString(),
      pedigreeName: '',
      dogsNzRegistration: '',
      breed: '',
      events: []
    };

    updateDogData([...dogs, newDog]);
    setExpandedDog(newDog.id);
  };

  const updateDog = (dogId: string, updatedDog: DogEntry) => {
    updateDogData(dogs.map(dog => 
      dog.id === dogId ? updatedDog : dog
    ));
  };

  const removeDog = (dogId: string) => {
    updateDogData(dogs.filter(dog => dog.id !== dogId));
    if (expandedDog === dogId) {
      setExpandedDog(null);
    }
  };

  const validateDuplicates = () => {
    const regEventCombos = new Set();
    
    for (const dog of dogs) {
      for (const event of dog.events) {
        const combo = `${dog.dogsNzRegistration}-${event.eventType}`;
        if (regEventCombos.has(combo)) {
          return false;
        }
        regEventCombos.add(combo);
      }
    }
    return true;
  };

  const isValid = () => {
    if (dogs.length === 0) return false;
    
    const allComplete = dogs.every(dog => 
      dog.pedigreeName.trim() &&
      dog.dogsNzRegistration.trim() &&
      dog.breed &&
      dog.events.length > 0 &&
      dog.events.every(event => 
        event.qualifyingShow.trim() && event.qualifyingDate
      ) &&
      dog.photo
    );

    return allComplete && validateDuplicates();
  };

  const handleContinue = () => {
    if (!validateDuplicates()) {
      toast({
        title: "Duplicate entries detected",
        description: "The same dog cannot be entered in the same event twice",
        variant: "destructive"
      });
      return;
    }

    if (isValid()) {
      nextStep();
    } else {
      toast({
        title: "Incomplete entries",
        description: "Please complete all dog entries before continuing",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dog Entries ({dogs.length})</span>
            <Button
              onClick={addNewDog}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Dog
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No dogs entered yet. Click "Add Dog" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dogs.map((dog, index) => (
                <Card key={dog.id} className="relative">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-smooth"
                    onClick={() => setExpandedDog(
                      expandedDog === dog.id ? null : dog.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Dog {index + 1}</Badge>
                        {dog.photoUrl && (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                            <img 
                              src={dog.photoUrl} 
                              alt={dog.pedigreeName || 'Dog photo'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {dog.pedigreeName || 'Unnamed Dog'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {dog.dogsNzRegistration || 'No registration'} • {dog.breed || 'No breed selected'}
                          </p>
                          {dog.events.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {dog.events.map((event, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {event.eventType}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDog(dog.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedDog === dog.id && (
                    <CardContent>
                      <DogEntryForm
                        dog={dog}
                        updateDog={(updatedDog) => updateDog(dog.id, updatedDog)}
                        onComplete={() => setExpandedDog(null)}
                      />
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!isValid()}
          className="min-w-[120px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DogEntries;