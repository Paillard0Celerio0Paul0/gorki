# Configuration du Bot Discord

## Étapes de configuration

### 1. **Créer un bot Discord**

1. Aller sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquer sur "New Application"
3. Donner un nom à votre bot (ex: "Gorki Magic Bot")
4. Aller dans l'onglet "Bot"
5. Cliquer sur "Add Bot"
6. Copier le **Token** du bot

### 2. **Configurer les permissions**

Dans l'onglet "Bot", activer les permissions suivantes :
- ✅ Send Messages
- ✅ Attach Files
- ✅ Embed Links
- ✅ Read Message History

**Important** : Dans l'onglet "Bot", activer aussi les **Privileged Gateway Intents** :
- ✅ Server Members Intent (si vous voulez accéder aux membres)
- ❌ Message Content Intent (pas nécessaire pour notre usage)

### 3. **Inviter le bot sur votre serveur**

1. Aller dans l'onglet "OAuth2" > "URL Generator"
2. Sélectionner les scopes : `bot`
3. Sélectionner les permissions : `Send Messages`, `Attach Files`, `Embed Links`, `Read Message History`
4. Copier l'URL générée et l'ouvrir dans votre navigateur
5. Sélectionner votre serveur Discord et autoriser le bot

### 4. **Obtenir l'ID du channel**

1. Activer le mode développeur dans Discord (Paramètres > Avancé > Mode développeur)
2. Faire un clic droit sur le channel où vous voulez envoyer les messages
3. Cliquer sur "Copier l'ID"
4. Copier cet ID

### 5. **Configuration des variables d'environnement**

Ajouter dans votre fichier `.env.local` :

```env
# Bot Discord
DISCORD_BOT_TOKEN=votre_token_bot_ici
DISCORD_CHANNEL_ID=votre_channel_id_ici

# Optionnel (ancien webhook)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 6. **Démarrer le bot**

```bash
# Démarrer le bot via l'API
curl -X POST http://localhost:3000/api/bot/start

# Vérifier l'état du bot
curl http://localhost:3000/api/bot/start
```

## Fonctionnalités

### **Lecteur audio natif**
- Le bot envoie les fichiers audio comme pièces jointes
- Discord affiche automatiquement un lecteur audio intégré
- Support des formats : MP3, WAV, OGG, etc.

### **Mentions utilisateurs**
- Utilise `<@discord_id>` pour mentionner les utilisateurs
- Les utilisateurs reçoivent une notification Discord

### **Messages personnalisés**
- Phrases aléatoires pour les sortilèges
- Embeds Discord avec informations sur l'expéditeur
- Gestion d'erreur avec fallback

## Test

1. Configurer les variables d'environnement
2. Démarrer l'application : `npm run dev`
3. Démarrer le bot : `POST /api/bot/start`
4. Tester la fonctionnalité mot magique
5. Vérifier que le lecteur audio s'affiche dans Discord

## Dépannage

### **Bot non connecté**
- Vérifier le token Discord
- Vérifier les permissions du bot
- Vérifier que le bot est invité sur le serveur

### **Channel invalide**
- Vérifier l'ID du channel
- Vérifier que le bot a accès au channel
- Vérifier les permissions du bot sur le channel

### **Audio non affiché**
- Vérifier le format du fichier (MP3 recommandé)
- Vérifier la taille du fichier (max 8MB)
- Vérifier les permissions d'envoi de fichiers
