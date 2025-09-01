import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Upload, Image, Check, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DogEntry, EventEntry, DOG_BREEDS, EVENT_TYPES, QUALIFICATION_REQUIREMENTS } from '@/types/form';
import photoGuidance from '@/assets/photo-guidance.png';
import { toast } from '@/hooks/use-toast';

interface DogEntryFormProps {
  dog: DogEntry;
  updateDog: (dog: DogEntry) => void;
  onComplete?: () => void;
}

const DogEntryForm: React.FC<DogEntryFormProps> = ({
  dog,
  updateDog,
  onComplete
}) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    dog.events.map(e => e.eventType)
  );

  const handleInputChange = (field: keyof DogEntry, value: any) => {
    updateDog({
      ...dog,
      [field]: value
    });
  };

  const handleEventToggle = (eventType: string) => {
    const isSelected = selectedEvents.includes(eventType);
    let newSelectedEvents: string[];

    if (isSelected) {
      newSelectedEvents = selectedEvents.filter(e => e !== eventType);
      // Remove the event from dog.events
      const newEvents = dog.events.filter(e => e.eventType !== eventType);
      updateDog({ ...dog, events: newEvents });
    } else {
      newSelectedEvents = [...selectedEvents, eventType];
      // Add new event to dog.events
      const newEvent: EventEntry = {
        eventType: eventType as any,
        qualifyingShow: '',
        qualifyingDate: ''
      };
      updateDog({ ...dog, events: [...dog.events, newEvent] });
    }

    setSelectedEvents(newSelectedEvents);
  };

  const updateEvent = (eventType: string, field: 'qualifyingShow' | 'qualifyingDate', value: string) => {
    const newEvents = dog.events.map(event =>
      event.eventType === eventType
        ? { ...event, [field]: value }
        : event
    );
    updateDog({ ...dog, events: newEvents });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview URL
    const photoUrl = URL.createObjectURL(file);
    
    updateDog({
      ...dog,
      photo: file,
      photoUrl
    });
  };

  const isMinDate = new Date(2024, 9, 14); // October 14, 2024
  const isMaxDate = new Date(2025, 9, 14); // October 14, 2025

  const isComplete = () => {
    return dog.pedigreeName.trim() &&
           dog.dogsNzRegistration.trim() &&
           dog.breed &&
           dog.events.length > 0 &&
           dog.events.every(event => 
             event.qualifyingShow.trim() && event.qualifyingDate
           ) &&
           dog.photo;
  };

  return (
    <div className="space-y-6">
      {/* Qualification Criteria Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Trophy className="w-5 h-5" />
            Qualification Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Your dog must have qualified by winning at a show between 14 October 2024 - 14 October 2025:
          </p>
          {Object.entries(QUALIFICATION_REQUIREMENTS).map(([eventType, requirement]) => (
            <div key={eventType} className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0 mt-0.5">{eventType}</Badge>
              <p className="text-sm text-muted-foreground">{requirement.requirement}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pedigreeName">Pedigree Name *</Label>
          <Input
            id="pedigreeName"
            value={dog.pedigreeName}
            onChange={(e) => handleInputChange('pedigreeName', e.target.value)}
            placeholder="Enter dog's pedigree name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dogsNzRegistration">DogsNZ Registration Number *</Label>
          <Input
            id="dogsNzRegistration"
            value={dog.dogsNzRegistration}
            onChange={(e) => handleInputChange('dogsNzRegistration', e.target.value)}
            placeholder="Enter registration number"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="breed">Breed *</Label>
          <Select value={dog.breed} onValueChange={(value) => handleInputChange('breed', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select breed" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {DOG_BREEDS.map((breed) => (
                <SelectItem key={breed} value={breed}>
                  {breed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Events Entered *</Label>
        <div className="space-y-3">
          {EVENT_TYPES.map((eventType) => {
            const isSelected = selectedEvents.includes(eventType);
            const event = dog.events.find(e => e.eventType === eventType);

            return (
              <Card key={eventType} className={cn(
                "transition-smooth",
                isSelected ? "border-primary bg-primary/5" : ""
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id={eventType}
                      checked={isSelected}
                      onCheckedChange={() => handleEventToggle(eventType)}
                    />
                    <Label htmlFor={eventType} className="font-medium cursor-pointer">
                      {eventType}
                    </Label>
                    <Badge variant="outline">$30</Badge>
                  </div>

                  {isSelected && event && (
                    <div className="grid gap-3 md:grid-cols-2 ml-6">
                      <div className="space-y-2">
                        <Label>Qualifying Show *</Label>
                        <Input
                          value={event.qualifyingShow}
                          onChange={(e) => updateEvent(eventType, 'qualifyingShow', e.target.value)}
                          placeholder="Enter qualifying show name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Qualifying Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !event.qualifyingDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {event.qualifyingDate ? 
                                format(new Date(event.qualifyingDate), "PPP") : 
                                "Pick a date"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={event.qualifyingDate ? new Date(event.qualifyingDate) : undefined}
                              onSelect={(date) => 
                                updateEvent(eventType, 'qualifyingDate', date?.toISOString().split('T')[0] || '')
                              }
                              disabled={(date) =>
                                date < isMinDate || date > isMaxDate
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground">
                          Must be between 14/10/2024 - 14/10/2025
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Photo Upload *</Label>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <img 
              src={photoGuidance} 
              alt="Photo guidance - good vs bad examples" 
              className="w-full rounded-lg border"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload a clear, high-quality stacked photo like the example shown
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-smooth">
              {dog.photoUrl ? (
                <div className="space-y-3">
                  <img 
                    src={dog.photoUrl} 
                    alt="Uploaded dog photo" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-center gap-2 text-success">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Photo uploaded</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`photo-${dog.id}`)?.click()}
                    className="w-full"
                  >
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload Photo</p>
                    <p className="text-sm text-muted-foreground">
                      JPG or PNG, max 10MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`photo-${dog.id}`)?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </div>
              )}
              
              <input
                id={`photo-${dog.id}`}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={onComplete}
          disabled={!isComplete()}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Complete Entry
        </Button>
      </div>
    </div>
  );
};

export default DogEntryForm;