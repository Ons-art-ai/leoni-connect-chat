import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Video, Phone, X, Mic, MicOff, VideoOff } from 'lucide-react';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'video' | 'audio';
  contactName: string;
}

export const VideoCall = ({ isOpen, onClose, callType, contactName }: VideoCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Simulation du temps d'appel
  useState(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
          {/* Video Area */}
          <div className="relative h-full">
            {callType === 'video' && !isVideoOff ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">{contactName[0]}</span>
                  </div>
                  <p className="text-xl font-semibold">{contactName}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-16 w-16" />
                  </div>
                  <p className="text-xl font-semibold">{contactName}</p>
                  <p className="text-gray-300">Appel en cours...</p>
                </div>
              </div>
            )}

            {/* Self Video Preview */}
            {callType === 'video' && !isVideoOff && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <span className="text-white text-sm">Vous</span>
                </div>
              </div>
            )}

            {/* Call Info */}
            <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2">
              <Badge variant="secondary" className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {formatDuration(callDuration)}
              </Badge>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              {callType === 'video' && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`rounded-full w-14 h-14 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                >
                  {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </Button>
              )}

              <Button
                variant="ghost"
                size="lg"
                onClick={onClose}
                className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};