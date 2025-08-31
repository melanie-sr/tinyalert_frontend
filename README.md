# 🚨 Tiny Alert

Tiny Alert est une application web destinée à sensibiliser et informer sur différentes catastrophes naturelles. Elle fournit une interface simple et intuitive pour consulter des informations et s'y préparer.

---

## 📦 Installation

Assurez-vous d'avoir **Node.js** installé sur votre machine.  
Clonez le projet, allez dans le dossier 'frontend_web', puis installez les dépendances :

```bash
npm install
```

# Compléter le .env

## 🚀 Lancement

```bash
npm run dev
```

## Tests Front  

### Organisation des tests

Home : page d’accueil avec titre, sous-titre, boutons et liste des catastrophes.

Disasters : page pour filtrer et afficher les catastrophes.

NavBar : barre de navigation avec liens, login/logout et sélecteur de langue.

LanguageSelector : changement de langue avec drapeaux.

Login : formulaire de connexion.

Register : formulaire d’inscription.

Profile : formulaire de profil utilisateur.

Footer : pied de page.


### Lancer les tests 

Pour lancer les tests globalement : 

``` npm run test```

Pour lancer un test en particulier (describe): 

``` npx jest -t "Nom du describe" ```