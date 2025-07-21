# Configuration Firebase pour Leoni Connect Chat

## Étapes pour configurer votre nouveau projet Firebase

### 1. Créer un nouveau projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Donnez un nom à votre projet (ex: "leoni-connect-chat")
4. Suivez les étapes de création

### 2. Activer Firestore Database
1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Démarrer en mode test" pour commencer
4. Sélectionnez une région proche (ex: europe-west1)

### 3. Configurer les règles Firestore
Dans l'onglet "Règles" de Firestore, remplacez le contenu par:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre lecture/écriture pour les messages
    match /messages/{messageId} {
      allow read, write: if true;
    }
    
    // Permettre lecture/écriture pour les statuts utilisateurs
    match /user_status/{statusId} {
      allow read, write: if true;
    }
  }
}
```

### 4. Obtenir la configuration
1. Dans "Paramètres du projet" (icône engrenage)
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône web `</>`
4. Donnez un nom à votre app (ex: "leoni-chat-web")
5. Copiez l'objet `firebaseConfig`

### 5. Mettre à jour la configuration dans le code
Remplacez le contenu de `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// REMPLACEZ PAR VOTRE VRAIE CONFIGURATION
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
```

### 6. Test de fonctionnement
Après la configuration:
1. Ouvrez la console du navigateur (F12)
2. Connectez-vous avec un utilisateur
3. Envoyez un message
4. Vérifiez les logs: vous devriez voir "🟢 Firebase connecté"
5. Le message doit apparaître dans Firestore Console

### 7. Résolution des problèmes courants

#### Erreur "Missing or insufficient permissions"
- Vérifiez que les règles Firestore sont correctement configurées
- Assurez-vous que le mode "test" est activé

#### Erreur "Failed to get document"
- Vérifiez que l'ID du projet est correct
- Vérifiez que Firestore est activé

#### Messages ne s'affichent pas en temps réel
- Ouvrez les outils de développement (F12)
- Regardez les logs dans la console
- Les messages devraient apparaître avec "📡 Snapshot reçu"

### Structure des données dans Firestore

#### Collection: `messages`
```javascript
{
  text: "Contenu du message",
  senderEmail: "user@example.com",
  senderName: "Nom Utilisateur", 
  type: "text", // ou "file", "voice"
  site: "Site sélectionné",
  department: "Département sélectionné",
  conversationId: "site_departement",
  timestamp: [Timestamp Firebase],
  fileName?: "nom-fichier.pdf", // optionnel
  fileSize?: "1.2 MB" // optionnel
}
```

#### Collection: `user_status`
```javascript
{
  userEmail: "user@example.com",
  site: "Site sélectionné", 
  department: "Département sélectionné",
  isOnline: true,
  lastSeen: [Timestamp Firebase],
  conversationId: "site_departement"
}
```

### Commandes de débogage
Dans la console du navigateur, vous pouvez tester:

```javascript
// Vérifier la connexion
console.log('Firebase App:', firebase.apps);

// Voir les messages en temps réel
// (Les logs apparaissent automatiquement avec les emojis 🔄📨✅)
```

## Support
Si vous rencontrez des problèmes, vérifiez:
1. Que Firebase est bien configuré
2. Que les règles Firestore permettent l'accès
3. Que la configuration est correcte dans le code
4. Les logs de la console pour des erreurs spécifiques