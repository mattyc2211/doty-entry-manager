import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Search, Download, Users, DollarSign, Trophy, Utensils } from 'lucide-react';
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
    const csvData = submissions.map(sub => ({
      'Submission ID': sub.submission_id,
      'Date': new Date(sub.created_at).toLocaleDateString(),
      'Name': `${sub.exhibitor_first_name} ${sub.exhibitor_surname}`,
      'Email': sub.exhibitor_email,
      'Phone': sub.exhibitor_phone,
      'Dogs': sub.dogs.length,
      'Events': sub.dogs.reduce((sum, dog) => sum + dog.events.length, 0),
      'Dinner Tickets': sub.dinner_tickets,
      'Extra Catalogues': sub.extra_catalogues,
      'Total Amount': `$${sub.total_amount}`,
      'Dietary Requirements': sub.dietary_requirements || 'None'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.exhibitor_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.exhibitor_surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.exhibitor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.submission_id.toLowerCase().includes(searchTerm.toLowerCase())
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
            Export CSV
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
                      <TableHead>Dogs</TableHead>
                      <TableHead>Events</TableHead>
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
                        <TableCell>
                          <div className="space-y-1">
                            {submission.dogs.map((dog, idx) => (
                              <div key={dog.id} className="text-sm">
                                <Badge variant="outline">
                                  {dog.pedigree_name} ({dog.breed})
                                </Badge>
                              </div>
                            ))}
                            {submission.dogs.length === 0 && (
                              <span className="text-muted-foreground text-sm">Catering only</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {submission.dogs.map((dog) => 
                              dog.events.map((event, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {event.event_type}
                                </Badge>
                              ))
                            )}
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
      </div>
    </div>
  );
};

export default AdminDashboard;