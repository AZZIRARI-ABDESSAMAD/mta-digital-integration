# 🚀 Portail Web d'Intégration d'Entreprise - MTA Automotive

## 📖 À propos du projet
Ce projet est une plateforme web complète développée de A à Z pour **MTA Automotive** afin de numériser et d'optimiser le processus d'intégration (onboarding) des nouveaux collaborateurs. L'application intègre des fonctionnalités avancées d'Intelligence Artificielle pour assister les opérateurs de manière interactive.

---

## 🛠️ Stack Technique

### **Front-end :**
* React.js
* Tailwind CSS

### **Back-end :**
* Laravel (PHP)
* Développement d'API REST
* Laravel Sanctum (Authentification et Sécurité)

### **Base de données & Intelligence Artificielle :**
* MySQL
* API Gemini Vision (Google) pour l'assistance et l'analyse intelligente
* Azure Speech pour la synthèse vocale

---

## ✨ Fonctionnalités Principales
* **Numérisation Complète :** Remplacement des processus d'onboarding manuels par un flux numérique structuré et intuitif.
* **Authentification Sécurisée :** Gestion des sessions et sécurisation des routes API via Laravel Sanctum.
* **Assistance IA (Voix & Vision) :** Intégration de l'API Gemini et Azure Speech pour guider les utilisateurs vocalement et visuellement à travers les étapes de l'intégration.
* **Architecture Découplée :** Séparation claire entre le Front-end (React) et le Back-end (Laravel) via une API REST performante.

---

## ⚙️ Prérequis
Pour faire tourner ce projet localement, vous aurez besoin de :
* PHP >= 8.1
* Composer
* Node.js & npm
* MySQL

---

## 🚀 Installation & Configuration

### 1. Configuration du Back-end (Laravel)
```bash
# Accéder au dossier backend
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé de l'application
php artisan key:generate

# Configurer la base de données et ajouter les clés API (Gemini & Azure) dans le fichier .env
# Lancer les migrations pour créer les tables
php artisan migrate

# Lancer le serveur local
php artisan serve

2. Configuration du Front-end (React)
Bash
# Accéder au dossier frontend
cd frontend

# Installer les dépendances Node
npm install

# Lancer le serveur de développement
npm run dev
👨‍💻 Développé par
AZZIRARI ABDESSAMAD

Développeur Full-Stack Junior

LinkedIn : linkedin.com/in/azzirariabdessamad

GitHub : github.com/AZZIRARI-ABDESSAMAD
