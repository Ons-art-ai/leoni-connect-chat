import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  location: string;
  description: string;
}

export const CalendarMeeting = ({ isOpen, onClose }: CalendarProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Réunion équipe Production',
      date: '2024-01-20',
      time: '09:00',
      duration: '1h',
      participants: ['ahmed.ben@leoni.com', 'sara.khalil@leoni.com'],
      location: 'Salle de conférence A',
      description: 'Point mensuel sur les objectifs de production'
    },
    {
      id: '2',
      title: 'Formation sécurité',
      date: '2024-01-22',
      time: '14:00',
      duration: '2h',
      participants: ['formation@leoni.com'],
      location: 'Salle formation',
      description: 'Formation obligatoire sécurité industrielle'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '1h',
    participants: '',
    location: '',
    description: ''
  });

  const { toast } = useToast();

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      participants: newMeeting.participants.split(',').map(p => p.trim()).filter(p => p)
    };

    setMeetings(prev => [...prev, meeting]);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '1h',
      participants: '',
      location: '',
      description: ''
    });
    setShowCreateForm(false);

    toast({
      title: "Réunion créée",
      description: "La réunion a été programmée avec succès"
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span>Calendrier des Réunions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Réunions programmées</h3>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réunion
            </Button>
          </div>

          {/* Create Meeting Form */}
          {showCreateForm && (
            <div className="border rounded-lg p-6 bg-muted/50">
              <h4 className="font-semibold mb-4">Créer une nouvelle réunion</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la réunion"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Salle de réunion"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Select 
                    value={newMeeting.duration} 
                    onValueChange={(value) => setNewMeeting(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1h">1 heure</SelectItem>
                      <SelectItem value="1h30">1h30</SelectItem>
                      <SelectItem value="2h">2 heures</SelectItem>
                      <SelectItem value="3h">3 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="participants">Participants (emails séparés par virgule)</Label>
                  <Input
                    id="participants"
                    value={newMeeting.participants}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, participants: e.target.value }))}
                    placeholder="user1@leoni.com, user2@leoni.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la réunion"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <Button onClick={handleCreateMeeting} className="bg-gradient-primary hover:opacity-90">
                  Créer la réunion
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* Meetings List */}
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{meeting.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(meeting.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{meeting.participants.length} participant(s)</span>
                      </div>
                    </div>
                    {meeting.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
                    )}
                    {meeting.participants.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Participants: </span>
                        <span className="text-sm text-muted-foreground">
                          {meeting.participants.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Rejoindre
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {meetings.length === 0 && !showCreateForm && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune réunion programmée</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};