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
  console.log('🔧 TEMPS RÉEL: Démarrage écoute pour conversation:', conversationId);
  
  // Requête optimisée pour temps réel
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  const unsubscribe = onSnapshot(
    q, 
    (querySnapshot) => {
      console.log('📡 TEMPS RÉEL: Changement détecté!', querySnapshot.size, 'messages');
      
      if (querySnapshot.empty) {
        console.log('📭 TEMPS RÉEL: Conversation vide');
        callback([]);
        return;
      }

      const messages: FirebaseMessage[] = [];
      
      // Traiter chaque changement en temps réel
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('➕ TEMPS RÉEL: Nouveau message ajouté:', change.doc.id);
        }
        if (change.type === 'modified') {
          console.log('✏️ TEMPS RÉEL: Message modifié:', change.doc.id);
        }
        if (change.type === 'removed') {
          console.log('🗑️ TEMPS RÉEL: Message supprimé:', change.doc.id);
        }
      });

      // Récupérer tous les messages
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || Date.now())
        } as FirebaseMessage);
      });
      
      console.log('📬 TEMPS RÉEL: Envoi de', messages.length, 'messages au chat');
      callback(messages);
    }, 
    (error) => {
      console.error('❌ TEMPS RÉEL: Erreur écoute Firestore:', error);
      
      // Fallback sans orderBy si problème d'index
      if (error.code === 'failed-precondition') {
        console.log('🔄 TEMPS RÉEL: Fallback sans orderBy...');
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
              timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || Date.now())
            } as FirebaseMessage);
          });
          
          // Tri manuel par timestamp
          messages.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
            return timeA - timeB;
          });
          
          console.log('📬 TEMPS RÉEL (FALLBACK): Envoi de', messages.length, 'messages');
          callback(messages);
        });
      }
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