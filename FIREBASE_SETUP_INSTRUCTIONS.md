# Instructions de Configuration Firebase pour Leoni Connect Chat

## Étapes de Configuration Firebase

### 1. Créer un Projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "leoni-connect-chat")
4. Suivez les étapes de configuration

### 2. Activer les Services Nécessaires

#### Firestore Database
1. Dans la console Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Commencer en mode test" pour le développement
4. Sélectionnez une région proche (Europe West)

#### Authentication (Optionnel)
1. Allez dans "Authentication"
2. Activez "Email/Password" dans l'onglet "Sign-in method"

#### Storage (Pour les fichiers)
1. Allez dans "Storage"
2. Cliquez sur "Commencer"
3. Choisissez les règles par défaut

### 3. Obtenir la Configuration
1. Allez dans "Paramètres du projet" (icône engrenage)
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône web "</>"
4. Enregistrez votre application (ex: "leoni-chat-web")
5. Copiez la configuration qui apparaît

### 4. Configurer l'Application
1. Ouvrez le fichier `src/config/firebase.ts`
2. Remplacez la configuration par défaut par vos vraies valeurs :

```typescript
const firebaseConfig = {
  apiKey: "VOTRE_VRAIE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 5. Règles de Sécurité Firestore
Allez dans Firestore > Règles et utilisez ces règles pour commencer :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, write: if true; // À modifier pour plus de sécurité
    }
  }
}
```

### 6. Structure des Collections
La collection `messages` aura cette structure :
```
messages/
  - text: string
  - timestamp: timestamp
  - senderEmail: string
  - senderName: string
  - type: "text" | "voice" | "file"
  - fileName?: string
  - fileSize?: string
  - site: string
  - department: string
  - conversationId: string
```

### 7. Test de Fonctionnement
1. Lancez votre application
2. Envoyez un message
3. Vérifiez dans Firebase Console > Firestore que le message apparaît
4. Ouvrez l'application dans plusieurs onglets pour tester la synchronisation temps réel

## Fonctionnalités Implémentées
- ✅ Envoi de messages en temps réel
- ✅ Réception de messages en temps réel
- ✅ Messages par site et département
- ✅ Partage de fichiers
- ✅ Identification des expéditeurs
- ✅ Horodatage des messages

## Prochaines Étapes (Optionnelles)
1. Ajouter l'authentification Firebase
2. Améliorer les règles de sécurité
3. Ajouter le stockage de fichiers
4. Implémenter les messages vocaux
5. Ajouter la notification push