import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseMessage {
  id?: string;
  text: string;
  timestamp: Timestamp | Date;
  senderEmail: string;
  senderName: string;
  type: 'text' | 'voice' | 'file';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  site: string;
  department: string;
  conversationId: string;
}

// Fonction pour envoyer un message
export const sendMessage = async (messageData: Omit<FirebaseMessage, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

// Fonction pour écouter les messages en temps réel
export const subscribeToMessages = (
  site: string, 
  department: string,
  callback: (messages: FirebaseMessage[]) => void
) => {
  const conversationId = `${site}_${department}`;
  
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages: FirebaseMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as FirebaseMessage);
    });
    callback(messages);
  });
};

// Fonction pour obtenir l'ID de conversation
export const getConversationId = (site: string, department: string): string => {
  return `${site}_${department}`;
};