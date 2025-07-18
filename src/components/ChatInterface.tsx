import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Video, 
  Phone, 
  MonitorSpeaker, 
  Mic, 
  Calendar,
  History,
  LogOut,
  Paperclip,
  Smile,
  MoreVertical,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  userEmail: string;
  selectedSite: string;
  selectedDepartment: string;
  onLogout: () => void;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  sender: string;
  type: 'text' | 'voice' | 'file';
}

export const ChatInterface = ({ userEmail, selectedSite, selectedDepartment, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue dans Leoni Connect Chat! 👋',
      timestamp: new Date(),
      isOwn: false,
      sender: 'Système',
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date(),
        isOwn: true,
        sender: userEmail.split('@')[0],
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulation d'une réponse automatique
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Message reçu! Comment puis-je vous aider?',
          timestamp: new Date(),
          isOwn: false,
          sender: 'Support IT',
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVideoCall = () => {
    toast({
      title: "Appel vidéo",
      description: "Fonction d'appel vidéo sera disponible prochainement"
    });
  };

  const startAudioCall = () => {
    toast({
      title: "Appel audio",
      description: "Fonction d'appel audio sera disponible prochainement"
    });
  };

  const shareScreen = () => {
    toast({
      title: "Partage d'écran",
      description: "Fonction de partage d'écran sera disponible prochainement"
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Arrêt enregistrement" : "Début enregistrement",
      description: isRecording ? "Message vocal arrêté" : "Enregistrement du message vocal..."
    });
  };

  const openCalendar = () => {
    toast({
      title: "Calendrier",
      description: "Fonction calendrier de réunions sera disponible prochainement"
    });
  };

  const showHistory = () => {
    toast({
      title: "Historique",
      description: "Affichage de l'historique des messages"
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6" />
            <div>
              <h1 className="font-semibold">Leoni Connect Chat</h1>
              <p className="text-sm text-blue-100">
                {selectedSite} - {selectedDepartment}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={startVideoCall}
              className="text-white hover:bg-white/20"
            >
              <Video className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={startAudioCall}
              className="text-white hover:bg-white/20"
            >
              <Phone className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={shareScreen}
              className="text-white hover:bg-white/20"
            >
              <MonitorSpeaker className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={openCalendar}
              className="text-white hover:bg-white/20"
            >
              <Calendar className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={showHistory}
              className="text-white hover:bg-white/20"
            >
              <History className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {!message.isOwn && (
                  <p className="text-xs font-semibold mb-1">{message.sender}</p>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRecording}
              className={`${isRecording ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};