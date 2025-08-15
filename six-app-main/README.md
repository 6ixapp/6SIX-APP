# SIX 

## Core Concept

SIX maps your social network using your phone contacts and creates a hierarchical connection system:

- **1° Connections**: Your direct contacts
- **2° Connections**: Mutual connections (people who know both you and your contacts)
- **3° Connections**: Friends of mutuals (extended network)

This approach ensures that every connection has a mutual foundation, making interactions more meaningful and trustworthy.

## Key Features

### 🔐 Authentication & Onboarding
- **Phone Number Authentication**: Secure sign-up and login using phone numbers
- **Progressive Onboarding**: Multi-step setup process including:
  - Name entry and profile creation
  - Contact permission and network mapping
  - Interactive guides explaining the app's concept
  - Profile photo upload and personalization
  - Trait selection for better matching

### 📱 Main App Features

#### Home Feed
- **Category-based Posts**: Users can create posts in different categories:
  - General: Everyday updates and thoughts
  - Meet: Looking to meet new people
  - Chat: Seeking conversations
  - Opportunity: Professional or business opportunities
  - Help: Requests for assistance or support

- **Connection-based Visibility**: Posts can be targeted to specific connection degrees (1°, 2°, 3°)
- **Post Filtering**: View posts by category or connection level
- **Interactive Feed**: Like, accept, or reject posts from your network

#### Chat System
- **Direct Messaging**: Chat with your connections
- **Real-time Updates**: Live message synchronization using Supabase
- **Connection Management**: Add or remove connections
- **Chat History**: Persistent conversation storage

#### Profile Management
- **Profile Photos**: Multiple photo upload and carousel display
- **Personal Traits**: Keyword-based personality traits for better matching
- **Network Statistics**: View your connection counts and network reach
- **Profile Editing**: Update personal information and preferences

### 🔗 Network Discovery
- **Contact Integration**: Automatically maps your phone contacts
- **Mutual Connection Detection**: Identifies people who know your contacts
- **Connection Degrees**: Visual representation of your network layers
- **Neo4j Graph Database**: Advanced graph algorithms for relationship mapping

## Technical Architecture

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform with built-in tools and services
- **TypeScript**: Type-safe development
- **Expo Router**: File-based routing system
- **Zustand**: State management
- **React Native Reanimated**: Smooth animations and interactions

### Backend Services
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Neo4j**: Graph database for relationship mapping and network analysis
- **Custom Backend API**: Node.js/Express server for complex operations

### Key Dependencies
- **@supabase/supabase-js**: Database and authentication
- **expo-contacts**: Phone contact access
- **expo-image-picker**: Photo selection and upload
- **react-native-gesture-handler**: Touch interactions
- **axios**: HTTP client for API calls

### Database Schema

#### Core Tables
- **users**: User profiles with phone, name, photos, and traits
- **chats**: Chat sessions between users
- **messages**: Individual chat messages with read status
- **posts**: User-generated content with categories and visibility settings
- **post_reactions**: User interactions with posts (like, accept, reject)
- **user_connections**: Network relationships with degree tracking

#### Graph Database
- **Neo4j Nodes**: Users and their properties
- **Neo4j Relationships**: Connection types and degrees
- **Graph Algorithms**: Path finding and network analysis

## App Structure

### Navigation Flow
```
Landing → Phone Auth → Onboarding → Main App
                                    ├── Home (Posts Feed)
                                    ├── Chats (Messages)
                                    ├── Profile (User Settings)
                                    └── Six (Future Feature)
```

### Protected Routes
- **Onboarding**: Multi-step user setup
- **Main Tabs**: Core app functionality
- **Chat Details**: Individual conversation views
- **Profile Management**: User settings and editing

### State Management
- **AuthContext**: User authentication state
- **UserStore**: Current user profile and data
- **ChatStore**: Chat sessions and messages
- **PostStore**: Feed posts and interactions
- **PostModalStore**: Post creation modal state

## Development Setup

### Prerequisites
- Node.js (v18+)
- Expo CLI
- iOS Simulator or Android Emulator
- Supabase account
- Neo4j database

### Installation
```bash
npm install
npx expo start
```

### Environment Configuration
- Configure Supabase connection in `src/db/supabase.ts`
- Set up Neo4j backend URL in environment variables
- Configure Expo constants for API endpoints
