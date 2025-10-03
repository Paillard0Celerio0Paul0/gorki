# Fonctionnalité Mot Magique

## Description
Cette fonctionnalité permet aux utilisateurs connectés qui trouvent le mot magique d'envoyer des notifications Discord avec des messages audio personnalisés.

## Fonctionnalités

### 1. Découverte du mot magique
- Les utilisateurs connectés peuvent saisir un mot dans la carte "???" du composant Countdown
- Le mot est vérifié via l'API `/api/magic-word/check`
- Si correct, la modal du mot magique s'ouvre

### 2. Modal du mot magique
- **Sélection d'utilisateur** : Liste de tous les utilisateurs avec leur nom Discord et avatar
- **Sélection d'audio** : Choix entre fichiers audio prédéfinis ou enregistrement personnalisé
- **Envoi de notification** : Envoi d'un message Discord via webhook

### 3. Types d'audio supportés
- **Fichiers prédéfinis** : 4 fichiers audio disponibles dans `/public/audio/`
- **Enregistrement personnalisé** : Enregistrement audio en temps réel via le microphone

### 4. Notification Discord
- Format du message : `{utilisateur_courant} {phrase_aléatoire} {utilisateur_ciblé}`
- Phrases aléatoires prédéfinies (10 phrases différentes)
- Support des fichiers audio dans le message Discord
- Embed Discord avec informations sur l'expéditeur

## Configuration requise

### Variables d'environnement
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### Structure des dossiers
```
public/
├── audio/           # Fichiers audio prédéfinis
│   ├── notification1.mp3
│   ├── notification2.mp3
│   ├── notification3.mp3
│   └── notification4.mp3
└── uploads/
    └── audio/       # Fichiers audio uploadés par les utilisateurs
```

## APIs créées

### 1. `/api/users` (GET)
- Récupère la liste de tous les utilisateurs
- Retourne : id, username, avatar_url, discord_id
- Authentification requise

### 2. `/api/discord/notify` (POST)
- Envoie une notification Discord via webhook
- Paramètres : targetUserId, audioType, audioFile/audioUrl
- Authentification requise

### 3. `/api/audio/upload` (POST)
- Upload de fichiers audio
- Support des formats audio
- Limite de taille : 10MB
- Authentification requise

## Composants créés

### 1. `MagicWordModal`
- Modal principale avec sélection d'utilisateur et d'audio
- Gestion des états de chargement et d'erreur
- Interface responsive

### 2. `AudioSelector`
- Sélection entre fichiers prédéfinis et enregistrement
- Interface pour choisir le type d'audio

### 3. `AudioRecorder`
- Enregistrement audio en temps réel
- Gestion des permissions microphone
- Timer d'enregistrement
- Upload automatique après enregistrement

## Utilisation

1. L'utilisateur se connecte avec Discord
2. Il trouve le mot magique dans la carte "???"
3. La modal s'ouvre avec la liste des utilisateurs
4. Il sélectionne un utilisateur cible
5. Il choisit un audio (prédéfini ou enregistrement)
6. Il envoie la notification Discord

## Sécurité

- Authentification requise pour toutes les APIs
- Validation des types de fichiers audio
- Limite de taille des fichiers
- Vérification des permissions microphone
- Validation des données utilisateur

## Notes techniques

- Les enregistrements audio sont sauvegardés dans `/public/uploads/audio/`
- Les fichiers audio prédéfinis sont dans `/public/audio/`
- Le webhook Discord doit être configuré dans les variables d'environnement
- Les phrases aléatoires sont définies dans le code de l'API Discord
