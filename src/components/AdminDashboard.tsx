import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, Search, Download, Users, DollarSign, Trophy, Utensils, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface SubmissionData {
  id: string;
  submission_id: string;
  exhibitor_first_name: string;
  exhibitor_surname: string;
  exhibitor_email: string;
  exhibitor_phone: string;
  total_amount: number;
  dinner_tickets: number;
  extra_catalogues: number;
  dietary_requirements?: string;
  created_at: string;
  dogs: Array<{
    id: string;
    pedigree_name: string;
    breed: string;
    dogs_nz_registration: string;
    photo_url?: string;
    events: Array<{
      event_type: string;
      qualifying_show: string;
    }>;
  }>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalRevenue: 0,
    totalDogs: 0,
    totalEvents: 0
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch submissions
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionError) throw submissionError;

      // Fetch dog entries with events
      const enrichedSubmissions = await Promise.all(
        (submissionData || []).map(async (submission) => {
          const { data: dogs, error: dogsError } = await supabase
            .from('dog_entries')
            .select('*')
            .eq('submission_id', submission.id);

          if (dogsError) throw dogsError;

          // Fetch events for each dog
          const dogsWithEvents = await Promise.all(
            (dogs || []).map(async (dog) => {
              const { data: events, error: eventsError } = await supabase
                .from('event_entries')
                .select('*')
                .eq('dog_entry_id', dog.id);

              if (eventsError) throw eventsError;

              return {
                ...dog,
                events: events || []
              };
            })
          );

          return {
            ...submission,
            dogs: dogsWithEvents
          };
        })
      );

      setSubmissions(enrichedSubmissions);

      // Calculate stats
      const totalRevenue = enrichedSubmissions.reduce((sum, sub) => sum + Number(sub.total_amount), 0);
      const totalDogs = enrichedSubmissions.reduce((sum, sub) => sum + sub.dogs.length, 0);
      const totalEvents = enrichedSubmissions.reduce((sum, sub) => 
        sum + sub.dogs.reduce((dogSum, dog) => dogSum + dog.events.length, 0), 0);

      setStats({
        totalSubmissions: enrichedSubmissions.length,
        totalRevenue,
        totalDogs,
        totalEvents
      });

    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    onLogout();
  };

  const exportData = () => {
    // Create detailed CSV with one row per dog entry
    const detailedCsvData: any[] = [];
    
    submissions.forEach(sub => {
      if (sub.dogs.length === 0) {
        // Catering-only submission
        detailedCsvData.push({
          'Submission ID': sub.submission_id,
          'Date': new Date(sub.created_at).toLocaleDateString(),
          'Exhibitor First Name': sub.exhibitor_first_name,
          'Exhibitor Surname': sub.exhibitor_surname,
          'Email': sub.exhibitor_email,
          'Phone': sub.exhibitor_phone,
          'Dog Name': 'Catering Only',
          'Registration Number': 'N/A',
          'Breed': 'N/A',
          'Photo URL': 'N/A',
          'Event Type': 'N/A',
          'Qualifying Show': 'N/A',
          'Dinner Tickets': sub.dinner_tickets,
          'Extra Catalogues': sub.extra_catalogues,
          'Total Amount': `$${sub.total_amount}`,
          'Dietary Requirements': sub.dietary_requirements || 'None'
        });
      } else {
        // Submissions with dogs - one row per dog/event combination
        sub.dogs.forEach(dog => {
          if (dog.events.length === 0) {
            detailedCsvData.push({
              'Submission ID': sub.submission_id,
              'Date': new Date(sub.created_at).toLocaleDateString(),
              'Exhibitor First Name': sub.exhibitor_first_name,
              'Exhibitor Surname': sub.exhibitor_surname,
              'Email': sub.exhibitor_email,
              'Phone': sub.exhibitor_phone,
              'Dog Name': dog.pedigree_name,
              'Registration Number': dog.dogs_nz_registration,
              'Breed': dog.breed,
              'Photo URL': dog.photo_url || 'No photo',
              'Event Type': 'None',
              'Qualifying Show': 'None',
              'Dinner Tickets': sub.dinner_tickets,
              'Extra Catalogues': sub.extra_catalogues,
              'Total Amount': `$${sub.total_amount}`,
              'Dietary Requirements': sub.dietary_requirements || 'None'
            });
          } else {
            dog.events.forEach(event => {
              detailedCsvData.push({
                'Submission ID': sub.submission_id,
                'Date': new Date(sub.created_at).toLocaleDateString(),
                'Exhibitor First Name': sub.exhibitor_first_name,
                'Exhibitor Surname': sub.exhibitor_surname,
                'Email': sub.exhibitor_email,
                'Phone': sub.exhibitor_phone,
                'Dog Name': dog.pedigree_name,
                'Registration Number': dog.dogs_nz_registration,
                'Breed': dog.breed,
                'Photo URL': dog.photo_url || 'No photo',
                'Event Type': event.event_type,
                'Qualifying Show': event.qualifying_show,
                'Dinner Tickets': sub.dinner_tickets,
                'Extra Catalogues': sub.extra_catalogues,
                'Total Amount': `$${sub.total_amount}`,
                'Dietary Requirements': sub.dietary_requirements || 'None'
              });
            });
          }
        });
      }
    });

    const csv = [
      Object.keys(detailedCsvData[0]).join(','),
      ...detailedCsvData.map(row => Object.values(row).map(val => 
        String(val).includes(',') ? `"${val}"` : val
      ).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detailed_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.exhibitor_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.exhibitor_surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.exhibitor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.submission_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.dogs.some(dog => 
      dog.pedigree_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.dogs_nz_registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">NZ Premier Dog Show 2025</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Dogs Entered</p>
                <p className="text-2xl font-bold">{stats.totalDogs}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Utensils className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Detailed CSV
          </Button>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading submissions...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Exhibitor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="min-w-80">Dog Details</TableHead>
                      <TableHead>Event Summary</TableHead>
                      <TableHead>Catering</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-mono text-sm">
                          {submission.submission_id}
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {submission.exhibitor_first_name} {submission.exhibitor_surname}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{submission.exhibitor_email}</p>
                            <p className="text-muted-foreground">{submission.exhibitor_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="space-y-2">
                            {submission.dogs.map((dog, idx) => (
                              <div key={dog.id} className="border rounded-lg p-2 bg-muted/20">
                                <div className="flex gap-3">
                                  {/* Photo thumbnail */}
                                  <div className="flex-shrink-0">
                                    {dog.photo_url ? (
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <div className="cursor-pointer group">
                                            <img 
                                              src={dog.photo_url} 
                                              alt={`${dog.pedigree_name} photo`}
                                              className="w-12 h-12 object-cover rounded border group-hover:opacity-80 transition-opacity"
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling?.classList.remove('hidden');
                                              }}
                                            />
                                            <div className="hidden w-12 h-12 bg-muted rounded border flex items-center justify-center">
                                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                          </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                          <img 
                                            src={dog.photo_url} 
                                            alt={`${dog.pedigree_name} full size`}
                                            className="w-full h-auto rounded"
                                          />
                                        </DialogContent>
                                      </Dialog>
                                    ) : (
                                      <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Dog details */}
                                  <div className="flex-1 space-y-1">
                                    <div className="font-medium text-sm text-primary">
                                      {dog.pedigree_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                      <div><strong>Reg:</strong> {dog.dogs_nz_registration}</div>
                                      <div><strong>Breed:</strong> {dog.breed}</div>
                                    </div>
                                    <div className="space-y-1">
                                      {dog.events.map((event, eventIdx) => (
                                        <div key={eventIdx} className="text-xs">
                                          <Badge variant="secondary" className="text-xs mr-2">
                                            {event.event_type}
                                          </Badge>
                                          <span className="text-muted-foreground">
                                            at {event.qualifying_show}
                                          </span>
                                        </div>
                                      ))}
                                      {dog.events.length === 0 && (
                                        <Badge variant="outline" className="text-xs">
                                          No events
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {submission.dogs.length === 0 && (
                              <span className="text-muted-foreground text-sm">Catering only</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium mb-1">
                              {submission.dogs.reduce((sum, dog) => sum + dog.events.length, 0)} total events
                            </div>
                            <div className="space-y-1">
                              {Array.from(new Set(submission.dogs.flatMap(dog => dog.events.map(e => e.event_type)))).map(eventType => (
                                <Badge key={eventType} variant="outline" className="text-xs mr-1">
                                  {eventType}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {submission.dinner_tickets > 0 && (
                              <p>🍽️ {submission.dinner_tickets} dinner tickets</p>
                            )}
                            {submission.extra_catalogues > 0 && (
                              <p>📖 {submission.extra_catalogues} catalogues</p>
                            )}
                            {submission.dinner_tickets === 0 && submission.extra_catalogues === 0 && (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          ${submission.total_amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsOverview />
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;