# 🧪 Plan de Test - Système de Prédictions

## ✅ Checklist de Tests

### 🔐 Authentification
- [ ] Connexion Discord fonctionne
- [ ] Redirection après connexion
- [ ] Overlay utilisateur s'affiche
- [ ] Déconnexion fonctionne
- [ ] Protection des routes admin

### 👑 Interface Admin
- [ ] Accès `/admin/predictions` (admin uniquement)
- [ ] Statistiques de limites s'affichent
- [ ] Création prédiction journalière (1pt)
- [ ] Création prédiction hebdomadaire (3pts)
- [ ] Limite 1 journalière par jour respectée
- [ ] Limite 3 hebdomadaires par semaine respectée
- [ ] Validation prédictions (VRAIE/FAUSSE)
- [ ] Fermeture automatique des votes

### 🗳️ Interface Utilisateur
- [ ] Page `/predictions` accessible (connecté uniquement)
- [ ] Onglets journalières/hebdomadaires
- [ ] Affichage des prédictions actives
- [ ] Vote OUI/NON fonctionne
- [ ] Statistiques de vote temps réel
- [ ] Temps restant affiché
- [ ] Vote impossible après fermeture
- [ ] Score personnel mis à jour

### 📊 Système de Scoring
- [ ] Calcul automatique des points
- [ ] Score journalières (1pt chacune)
- [ ] Score hebdomadaires (3pts chacune)
- [ ] Précision calculée correctement
- [ ] Mise à jour après validation admin

### 🏆 Leaderboard
- [ ] Classement par points
- [ ] Classement par précision
- [ ] Podium top 3
- [ ] Statistiques globales
- [ ] Seuls les utilisateurs actifs affichés

### 🎨 Interface & UX
- [ ] Design cohérent sur toutes les pages
- [ ] Responsive mobile/desktop
- [ ] Animations et transitions
- [ ] Messages d'erreur clairs
- [ ] Loading states
- [ ] Navigation intuitive

### 🔧 Base de Données
- [ ] Tables créées correctement
- [ ] Relations fonctionnelles
- [ ] Index de performance
- [ ] Contraintes d'unicité
- [ ] Cascade des suppressions

## 🚀 Commandes de Test

### Configuration Admin
```bash
# 1. Connecte-toi d'abord avec Discord
# 2. Puis configure-toi comme admin :
node scripts/setup-admin.js

# 3. Définir un admin spécifique :
node scripts/setup-admin.js --set-admin <discord_id>
```

### Tests de Base
```bash
# Démarrer l'application
npm run dev

# Ouvrir Prisma Studio
npm run db:studio

# Vérifier les logs
# Regarder la console navigateur et terminal
```

### Tests de Charge
```bash
# Ouvrir plusieurs onglets incognito
# Se connecter avec différents comptes Discord
# Tester les votes simultanés
```

## 🐛 Bugs Potentiels à Vérifier

### Problèmes de Timing
- [ ] Votes après 23h59 (journalières)
- [ ] Votes après dimanche (hebdomadaires)
- [ ] Validation admin après fermeture

### Problèmes de Permissions
- [ ] Utilisateur normal accède `/admin`
- [ ] Admin peut voter normalement
- [ ] Votes multiples du même utilisateur

### Problèmes de Données
- [ ] Prédictions sans texte
- [ ] Votes invalides (null, undefined)
- [ ] Scores négatifs ou incorrects

## 📝 Scénarios de Test

### Scénario 1 : Admin Créateur
1. Connecte-toi comme admin
2. Crée 1 prédiction journalière
3. Crée 2 prédictions hebdomadaires
4. Vote sur tes propres prédictions
5. Valide tes prédictions
6. Vérifie ton score

### Scénario 2 : Utilisateur Normal
1. Connecte-toi (pas admin)
2. Va sur `/predictions`
3. Vote sur toutes les prédictions
4. Vérifie ton score personnel
5. Va sur le leaderboard

### Scénario 3 : Multi-utilisateurs
1. Connecte plusieurs comptes Discord
2. Vote sur les mêmes prédictions
3. Vérifie les statistiques globales
4. Teste le leaderboard

## ✅ Critères de Succès

- [ ] Toutes les fonctionnalités marchent
- [ ] Aucune erreur console
- [ ] Performance acceptable
- [ ] UX fluide et intuitive
- [ ] Sécurité respectée
- [ ] Données cohérentes

## 🆘 En Cas de Problème

### Erreurs de Base de Données
```bash
# Reset complet
npm run db:reset
npm run db:push
```

### Erreurs d'Authentification
```bash
# Vérifier les variables d'environnement
cat .env.local
```

### Erreurs de Build
```bash
# Nettoyer et rebuilder
rm -rf .next
npm run build
```
