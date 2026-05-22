# VisaFlow Pro — Guide de Démarrage

## Architecture Complète

```
visa-flow-pro/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Pages login, register, forgot-password
│   │   ├── (client)/            # Espace client (dashboard, applications, IA...)
│   │   ├── (admin)/admin/       # Back-office admin complet
│   │   ├── (marketing)/         # Landing page, services, pricing, FAQ, contact
│   │   └── api/                 # Routes backend
│   │       ├── auth/            # NextAuth + register
│   │       ├── applications/    # CRUD dossiers + messages
│   │       ├── ai/chat/         # IA OpenAI visa spécialisé
│   │       ├── visa/countries/  # Pays & types de visa
│   │       ├── user/profile/    # Profil utilisateur
│   │       └── health/          # Health check
│   ├── components/
│   │   ├── admin/               # Dashboard admin, tables, charts
│   │   ├── applications/        # Formulaires, timeline, documents, messages
│   │   ├── client/              # Sidebar, header, dashboard, stats
│   │   ├── marketing/           # Navbar, footer marketing
│   │   ├── providers/           # Theme, Auth, Query providers
│   │   └── ui/                  # shadcn/ui + skeletons
│   ├── lib/
│   │   ├── auth.ts              # Config NextAuth + callbacks
│   │   ├── db.ts                # Prisma client singleton
│   │   └── utils.ts             # Helpers, formatters, constants
│   └── middleware.ts             # RBAC + rate limiting
├── prisma/
│   ├── schema.prisma            # Schéma complet 15+ modèles
│   └── seed.ts                  # Données de démonstration
├── docker-compose.yml           # PostgreSQL + Redis + App + Nginx
├── Dockerfile                   # Multi-stage build optimisé
├── .env.example                 # Variables d'environnement
└── package.json                 # Toutes les dépendances
```

## Installation Rapide

### 1. Cloner et installer

```bash
npm install --legacy-peer-deps
```

### 2. Configurer l'environnement

```bash
cp .env.example .env.local
# Remplir les valeurs dans .env.local
```

Variables minimum requises :
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/visaflowpro"
AUTH_SECRET="votre-secret-32-chars-minimum"
AUTH_GOOGLE_ID="votre-google-client-id"
AUTH_GOOGLE_SECRET="votre-google-secret"
OPENAI_API_KEY="sk-proj-..."
```

### 3. Lancer avec Docker (recommandé)

```bash
# Démarrer PostgreSQL + Redis
docker-compose up -d postgres redis

# Générer Prisma + migrations
npm run prisma:generate
npm run prisma:migrate

# Insérer les données de démo
npm run prisma:seed

# Lancer l'app en développement
npm run dev
```

### 4. Accès à l'application

| Rôle       | URL                    | Email                    | Mot de passe |
|------------|------------------------|--------------------------|--------------|
| Admin      | /admin/dashboard       | admin@visaflowpro.tn     | Admin@1234   |
| Agent      | /admin/dashboard       | agent@visaflowpro.tn     | Agent@1234   |
| Client démo| /dashboard             | client@demo.tn           | Client@1234  |
| Public     | /                      | —                        | —            |

---

## Pages et Fonctionnalités

### Marketing (public)
- `/` — Landing page premium avec animations Framer Motion
- `/services` — Détail des 7 pays couverts
- `/pricing` — 3 formules tarifaires
- `/faq` — 12+ questions fréquentes par catégorie
- `/contact` — Formulaire + infos de contact
- `/login` — Connexion Google OAuth + credentials
- `/register` — Inscription avec vérification de force du mot de passe
- `/forgot-password` — Demande de réinitialisation par email
- `/reset-password` — Formulaire de nouveau mot de passe (token)

### Espace Client
- `/dashboard` — KPIs, dossiers actifs, notifications
- `/applications` — Liste complète des demandes
- `/applications/new` — Formulaire 5 étapes : pays → type → formulaire → documents → validation
- `/applications/[id]` — Détail : timeline, documents, messagerie
- `/messages` — Vue messagerie globale
- `/notifications` — Centre de notifications
- `/ai-assistant` — Chatbot IA spécialisé visas
- `/settings` — Profil et préférences

### Administration
- `/admin/dashboard` — Vue d'ensemble + stats + charts
- `/admin/applications` — Table avancée avec filtres/export
- `/admin/users` — Gestion des utilisateurs et rôles
- `/admin/countries` — Pays et types de visa (CRUD complet)
- `/admin/forms` — Constructeur de formulaires drag & drop
- `/admin/analytics` — KPIs, tendances, répartition par statut/pays
- `/admin/audit-logs` — Journal d'audit complet (200 entrées)
- `/admin/notifications` — Centre de notifications globales

---

## Base de Données — Modèles Prisma

| Modèle           | Description                              |
|------------------|------------------------------------------|
| User             | Clients, agents, admins (RBAC)           |
| Account/Session  | NextAuth OAuth & sessions                |
| VisaCountry      | 7+ pays avec configuration               |
| VisaCountryType  | Types de visa par pays                   |
| FormTemplate     | Templates de formulaires                 |
| FormField        | Champs dynamiques par template           |
| WorkflowStep     | Étapes de traitement par type de visa   |
| Application      | Dossiers de visa (statut, données)       |
| ApplicationStep  | Suivi des étapes par dossier             |
| Document         | Pièces justificatives uploadées          |
| Message          | Messagerie client/agent                  |
| Notification     | Alertes temps réel                       |
| Payment          | Paiements et factures                    |
| Appointment      | Rendez-vous TLSContact/VFS               |
| AiConversation   | Historique conversations IA              |
| AuditLog         | Journal d'audit complet                  |
| BlogPost         | Blog/CMS intégré                         |
| Setting          | Configuration dynamique                  |

---

## Stack Technique

| Couche         | Technologie                                |
|----------------|--------------------------------------------|
| Framework      | Next.js 15 App Router + TypeScript         |
| UI             | TailwindCSS + shadcn/ui + Framer Motion    |
| Auth           | NextAuth v5 + Google OAuth + JWT           |
| BDD            | PostgreSQL + Prisma ORM                    |
| Cache          | Redis                                      |
| IA             | OpenAI GPT-4o                              |
| Upload         | UploadThing / Cloudinary                   |
| Emails         | Resend                                     |
| Déploiement    | Docker + Vercel / VPS                      |

---

## Déploiement Production

### Option A — Vercel + Neon PostgreSQL

```bash
# 1. Pousser sur GitHub
git push origin main

# 2. Connecter à Vercel
# 3. Configurer les variables d'env dans Vercel Dashboard
# 4. DATABASE_URL = URL Neon
# 5. npm run prisma:migrate
```

### Option B — Docker sur VPS

```bash
# Build de l'image
docker build -t visaflowpro:latest .

# Lancer tout l'environnement
docker-compose --profile production up -d

# Migrations
docker exec visaflowpro-app npx prisma migrate deploy
```

---

## Prochaines Étapes Recommandées

1. **Google OAuth** — Créer une app sur console.cloud.google.com
2. **OpenAI** — Créer une clé API sur platform.openai.com
3. **Resend** — Créer un compte sur resend.com pour les emails
4. **Cloudinary** — Pour le stockage des documents
5. **Notifications push** — Intégrer Pusher ou socket.io
6. **OCR passeport** — Activer tesseract.js pour la lecture auto
7. **Paiement** — Intégrer Flouci ou Stripe

---

*VisaFlow Pro — Plateforme SaaS Premium — Tous droits réservés*
