import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  Timestamp,
  enableNetwork,
  disableNetwork 
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
    console.log('📤 Envoi message:', messageData);
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: serverTimestamp()
    });
    console.log('✅ Message envoyé avec ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

// Fonction optimisée pour écouter les messages en temps réel
export const subscribeToMessages = (
  site: string, 
  department: string,
  callback: (messages: FirebaseMessage[]) => void
) => {
  const conversationId = getConversationId(site, department);
  console.log('🔧 Démarrage écoute temps réel pour:', conversationId);
  
  // Requête simple pour éviter les problèmes d'index
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId)
  );

  const unsubscribe = onSnapshot(
    q, 
    (querySnapshot) => {
      console.log('📡 Snapshot reçu - Nombre de docs:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.log('📭 Aucun message trouvé pour cette conversation');
        callback([]);
        return;
      }

      const messages: FirebaseMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Message reçu:', doc.id, data);
        
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || Date.now())
        } as FirebaseMessage);
      });
      
      // Trier par timestamp
      messages.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
        return timeA - timeB;
      });
      
      console.log('📬 Messages triés envoyés au callback:', messages.length);
      callback(messages);
    }, 
    (error) => {
      console.error('❌ Erreur écoute Firestore:', error);
      console.error('❌ Code erreur:', error.code);
      console.error('❌ Message:', error.message);
    }
  );

  return unsubscribe;
};

// Fonction pour obtenir l'ID de conversation
export const getConversationId = (site: string, department: string): string => {
  return `${site}_${department}`.toLowerCase().replace(/\s+/g, '_');
};

// Fonction simplifiée pour marquer un utilisateur comme en ligne
export const setUserOnline = async (userEmail: string, site: string, department: string) => {
  try {
    console.log('👤 Mise à jour statut utilisateur:', userEmail);
    await addDoc(collection(db, 'user_status'), {
      userEmail,
      site,
      department,
      isOnline: true,
      lastSeen: serverTimestamp(),
      conversationId: getConversationId(site, department)
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error);
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
      if (users.indexOf(data.userEmail) === -1) {
        users.push(data.userEmail);
      }
    });
    callback([...new Set(users)]); // Éliminer les doublons
  }, (error) => {
    console.error('❌ Erreur écoute utilisateurs en ligne:', error);
  });
};

// Fonction pour vérifier la connexion Firebase
export const checkFirebaseConnection = async () => {
  try {
    await enableNetwork(db);
    console.log('🟢 Firebase connecté');
    return true;
  } catch (error) {
    console.error('🔴 Firebase déconnecté:', error);
    return false;
  }
};