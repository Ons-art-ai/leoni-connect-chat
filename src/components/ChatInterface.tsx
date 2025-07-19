import { useState, useRef, useEffect } from 'react';
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
  Users,
  File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VideoCall } from '@/components/VideoCall';
import { CalendarMeeting } from '@/components/CalendarMeeting';
import { FileShare } from '@/components/FileShare';
import { sendMessage, subscribeToMessages, getConversationId, setUserOnline, subscribeToOnlineUsers, FirebaseMessage } from '@/services/chatService';
import { Timestamp } from 'firebase/firestore';

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
  fileName?: string;
  fileSize?: string;
}

export const ChatInterface = ({ userEmail, selectedSite, selectedDepartment, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [firebaseMessages, setFirebaseMessages] = useState<FirebaseMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFileShare, setShowFileShare] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Marquer l'utilisateur comme en ligne
  useEffect(() => {
    setUserOnline(userEmail, selectedSite, selectedDepartment);
  }, [userEmail, selectedSite, selectedDepartment]);

  // Écouter les utilisateurs en ligne
  useEffect(() => {
    const unsubscribe = subscribeToOnlineUsers(
      selectedSite,
      selectedDepartment,
      (users) => {
        setOnlineUsers(users);
      }
    );
    return () => unsubscribe();
  }, [selectedSite, selectedDepartment]);

  // Écouter les messages Firebase en temps réel
  useEffect(() => {
    setIsConnected(false);
    const unsubscribe = subscribeToMessages(
      selectedSite,
      selectedDepartment,
      (fbMessages) => {
        setIsConnected(true);
        setFirebaseMessages(fbMessages);
        // Convertir les messages Firebase en format local
        const convertedMessages: Message[] = fbMessages.map(msg => ({
          id: msg.id || '',
          text: msg.text,
          timestamp: msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date(msg.timestamp),
          isOwn: msg.senderEmail === userEmail,
          sender: msg.senderEmail === userEmail ? 'Vous' : `${msg.senderName} (${msg.senderEmail.split('@')[0]})`,
          type: msg.type,
          fileName: msg.fileName,
          fileSize: msg.fileSize
        }));
        setMessages(convertedMessages);
        
        // Toast pour nouveaux messages d'autres utilisateurs
        const latestMessage = fbMessages[fbMessages.length - 1];
        if (latestMessage && latestMessage.senderEmail !== userEmail && fbMessages.length > 1) {
          toast({
            title: "Nouveau message",
            description: `${latestMessage.senderName}: ${latestMessage.text.substring(0, 50)}...`
          });
        }
      }
    );

    return () => unsubscribe();
  }, [selectedSite, selectedDepartment, userEmail, toast]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          text: newMessage,
          senderEmail: userEmail,
          senderName: userEmail.split('@')[0],
          type: 'text' as const,
          site: selectedSite,
          department: selectedDepartment,
          conversationId: getConversationId(selectedSite, selectedDepartment)
        };

        await sendMessage(messageData);
        setNewMessage('');
        
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message. Vérifiez votre connexion.",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVideoCall = () => {
    setCallType('video');
    setShowVideoCall(true);
  };

  const startAudioCall = () => {
    setCallType('audio');
    setShowVideoCall(true);
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
    setShowCalendar(true);
  };

  const showHistory = () => {
    toast({
      title: "Historique",
      description: "Affichage de l'historique des messages"
    });
  };

  const handleFileShare = async (files: File[]) => {
    for (const file of files) {
      try {
        const messageData = {
          text: `Fichier partagé: ${file.name}`,
          senderEmail: userEmail,
          senderName: userEmail.split('@')[0],
          type: 'file' as const,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          site: selectedSite,
          department: selectedDepartment,
          conversationId: getConversationId(selectedSite, selectedDepartment)
        };

        await sendMessage(messageData);
        
        toast({
          title: "Fichier partagé",
          description: `${file.name} a été partagé avec succès`
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: `Impossible de partager ${file.name}`,
          variant: "destructive"
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <p className="text-xs text-blue-200">
                {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'} • {onlineUsers.length} utilisateur(s) en ligne
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

      {/* Modals */}
      <VideoCall 
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        callType={callType}
        contactName="Équipe Support"
      />

      <CalendarMeeting 
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      <FileShare 
        isOpen={showFileShare}
        onClose={() => setShowFileShare(false)}
        onFileSend={handleFileShare}
      />

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
                  : 'bg-muted text-muted-foreground border-l-4 border-blue-500'
              }`}>
                {!message.isOwn && (
                  <p className="text-xs font-semibold mb-1 text-blue-600">
                    {message.sender} • Leoni
                  </p>
                )}
                {message.type === 'file' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <File className="h-4 w-4" />
                    <span className="text-xs">{message.fileSize}</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1 flex items-center justify-between">
                  <span>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.isOwn && <span className="text-green-500">✓</span>}
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
              onClick={() => setShowFileShare(true)}
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