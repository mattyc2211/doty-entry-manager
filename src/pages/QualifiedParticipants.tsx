import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormHeader from '@/components/FormHeader';
import { Search, Filter, Trophy, MapPin } from 'lucide-react';

const QualifiedParticipants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');

  const participants = [
    {
      dogName: "Ch. Stellar Performance",
      breed: "Border Collie",
      owner: "Rebecca Martinez",
      region: "Auckland",
      qualificationShow: "Auckland Championship 2024",
      qualificationDate: "October 2024",
      events: ["Confirmation", "Movement", "Temperament"]
    },
    {
      dogName: "Ch. Midnight Magic",
      breed: "German Shepherd",
      owner: "David Thompson",
      region: "Wellington",
      qualificationShow: "Wellington Premier 2024",
      qualificationDate: "September 2024",
      events: ["Confirmation", "Movement"]
    },
    {
      dogName: "Ch. Golden Sunrise",
      breed: "Golden Retriever",
      owner: "Lisa Chen",
      region: "Christchurch",
      qualificationShow: "Canterbury Classic 2024",
      qualificationDate: "November 2024",
      events: ["Confirmation", "Temperament"]
    },
    {
      dogName: "Ch. Storm Shadow",
      breed: "Australian Cattle Dog",
      owner: "Michael Brown",
      region: "Hamilton",
      qualificationShow: "Waikato Regional 2024",
      qualificationDate: "August 2024",
      events: ["Confirmation", "Movement", "Temperament"]
    },
    {
      dogName: "Ch. Crimson Elite",
      breed: "Standard Poodle",
      owner: "Sarah Wilson",
      region: "Tauranga",
      qualificationShow: "Bay of Plenty Show 2024",
      qualificationDate: "October 2024",
      events: ["Confirmation"]
    },
    {
      dogName: "Ch. Thunder Strike",
      breed: "Rottweiler",
      owner: "James Rodriguez",
      region: "Dunedin",
      qualificationShow: "Otago Championship 2024",
      qualificationDate: "September 2024",
      events: ["Confirmation", "Movement"]
    }
  ];

  const breeds = [...new Set(participants.map(p => p.breed))].sort();

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.dogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBreed = selectedBreed === 'all' || participant.breed === selectedBreed;
    
    return matchesSearch && matchesBreed;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Qualified Participants</h1>
            <p className="text-xl text-muted-foreground">Dogs qualified for the 2025 Premier Show</p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {participants.length} Dogs Qualified
              </Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by dog name, owner, or breed..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Breeds</SelectItem>
                    {breeds.map(breed => (
                      <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Participants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredParticipants.map((participant, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        {participant.dogName}
                      </CardTitle>
                      <p className="text-lg text-primary font-medium">{participant.breed}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {participant.region}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Owner</h4>
                    <p className="text-muted-foreground">{participant.owner}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Qualification Details</h4>
                    <p className="text-sm text-muted-foreground">{participant.qualificationShow}</p>
                    <p className="text-sm text-muted-foreground">{participant.qualificationDate}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Registered Events</h4>
                    <div className="flex flex-wrap gap-1">
                      {participant.events.map((event, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No participants found matching your search criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Qualification Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{participants.length}</div>
                  <div className="text-sm text-muted-foreground">Total Qualified</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{breeds.length}</div>
                  <div className="text-sm text-muted-foreground">Breeds Represented</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {[...new Set(participants.map(p => p.region))].length}
                  </div>
                  <div className="text-sm text-muted-foreground">Regions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {participants.filter(p => p.events.length === 3).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Triple Events</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QualifiedParticipants;