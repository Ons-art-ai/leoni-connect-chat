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
  isOnline?: boolean;
  userRole?: string;
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
  console.log('🔧 Configuration écoute Firebase pour conversationId:', conversationId);
  
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, 
    (querySnapshot) => {
      console.log('📡 Snapshot reçu:', querySnapshot.size, 'documents');
      const messages: FirebaseMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Document:', doc.id, data);
        messages.push({
          id: doc.id,
          ...data,
          // Convertir le timestamp Firestore en Date si nécessaire
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
        } as FirebaseMessage);
      });
      console.log('📬 Messages finaux envoyés au callback:', messages.length);
      callback(messages);
    }, 
    (error) => {
      console.error('❌ Erreur lors de l\'écoute des messages:', error);
      console.error('❌ Code erreur:', error.code);
      console.error('❌ Message erreur:', error.message);
      
      // Fallback: essayer sans orderBy si problème d'index
      if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
        console.log('🔄 Tentative sans orderBy...');
        const fallbackQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', conversationId)
        );
        
        return onSnapshot(fallbackQuery, (querySnapshot) => {
          const messages: FirebaseMessage[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
            } as FirebaseMessage);
          });
          // Trier manuellement
          messages.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
            return timeA - timeB;
          });
          callback(messages);
        });
      }
    }
  );
};

// Fonction pour obtenir l'ID de conversation
export const getConversationId = (site: string, department: string): string => {
  return `${site}_${department}`;
};

// Fonction pour marquer un utilisateur comme en ligne
export const setUserOnline = async (userEmail: string, site: string, department: string) => {
  try {
    await addDoc(collection(db, 'user_status'), {
      userEmail,
      site,
      department,
      isOnline: true,
      lastSeen: serverTimestamp(),
      conversationId: getConversationId(site, department)
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
  }
};

// Fonction pour obtenir les utilisateurs en ligne
export const subscribeToOnlineUsers = (
  site: string,
  department: string,
  callback: (users: string[]) => void
) => {
  const conversationId = getConversationId(site, department);
  
  const q = query(
    collection(db, 'user_status'),
    where('conversationId', '==', conversationId),
    where('isOnline', '==', true)
  );

  return onSnapshot(q, (querySnapshot) => {
    const users: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push(data.userEmail);
    });
    callback(users);
  });
};