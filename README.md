# Oregon Chapter of American College of Physicians (ACP)

A modern, responsive web application for the Oregon Chapter of the American College of Physicians, built with React and Firebase.

## 🏥 About Oregon ACP

The American College of Physicians (ACP) is the largest medical-specialty society in the world, with over 160,000 members worldwide. The Oregon Chapter serves internal medicine specialists and subspecialists throughout Oregon.

**Mission**: "To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine."

## 🚀 Key Features

### Public Features

- **Homepage**: Welcome section with committee updates
- **Committee Updates**: Public blog posts from Awards, Policy, and Chapter Meeting committees
- **Events Calendar**: Chapter events and meetings
- **Resources**: Bylaws, policies, and local healthcare organization links
- **Scholarship Information**: Chapter scholarship details

### Administrative Features

- **Admin Dashboard**: Secure management interface
- **Blog Management**: Rich text editor for committee posts
- **User Management**: Role-based access control
- **Password Reset**: Firebase-based authentication
- **Profile Management**: User profiles with photo upload

## 🛠 Technology Stack

### Frontend

- **React 19.1.0** with TypeScript
- **Mantine 7.17.4** UI components
- **React Router 7.5.0** for routing
- **TipTap** rich text editor

### Backend

- **Firebase 11.6.0**
  - Authentication with custom claims
  - Firestore NoSQL database
  - Cloud Functions
  - Hosting & Storage

## 📁 Project Structure

```
oregonacp/
├── src/
│   ├── components/           # Reusable components
│   │   ├── BlogPostGrid/     # Blog management
│   │   ├── Hero/            # Hero sections
│   │   ├── Navbar.tsx       # Navigation
│   │   └── ProtectedRoute.tsx # Auth guard
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin pages
│   │   ├── Home.tsx         # Homepage
│   │   └── Resources.tsx    # Resources page
│   ├── contexts/            # React contexts
│   ├── firebase.ts          # Firebase config
│   └── App.tsx
├── functions/               # Cloud Functions
├── firestore.rules         # Security rules
└── firebase.json           # Firebase config
```

## 🏗 Architecture

### Data Models

**Blog Posts**

```typescript
interface BlogPost {
  id: string;
  authorId?: string;
  body: string;
  organization: string; // 'awards', 'policy', 'chapterMeeting'
  timestamp: Timestamp;
  visible: boolean;
}
```

**User Permissions**

```typescript
interface UserPermissions {
  permissions: {
    awardsBlog: boolean;
    policyBlog: boolean;
    chapterMeetingBlog: boolean;
  };
}
```

### Authentication & Authorization

- **Public Access**: Homepage, about, events, resources
- **Authenticated Access**: Admin dashboard
- **Role-Based Access**:
  - **Owner**: Full system access
  - **Executive**: User management + all committees
  - **Committee Members**: Specific committee access

## 🔒 Security

### Firebase Security Rules

- **Authentication Required**: Admin features require Firebase auth
- **Role-Based Access**: Custom claims enforce user roles
- **Committee Permissions**: Granular committee-specific access
- **Public Read Access**: Blog posts visible publicly (without author info for unauthenticated users)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Firebase CLI
- Git

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd oregonacp
   npm install
   cd functions && npm install && cd ..
   ```

2. **Environment Setup**
   Create `.env` file:

   ```env
   REACT_APP_API_KEY=your_api_key
   REACT_APP_AUTH_DOMAIN=your_auth_domain
   REACT_APP_PROJECT_ID=your_project_id
   REACT_APP_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_APP_ID=your_app_id
   REACT_APP_DATABASE_URL=your_database_url
   ```

3. **Firebase Setup**

   ```bash
   firebase login
   firebase use <your-project-id>
   ```

4. **Start Development**

   ```bash
   npm start
   ```

### Development Commands

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `firebase emulators:start` - Local Firebase services
- `firebase deploy` - Deploy to production

## 📝 Usage

### For Administrators

1. Navigate to `/admin` and login
2. Manage committee blogs and user permissions
3. Create and edit committee updates

### For Committee Members

1. Access committee-specific dashboard
2. Create posts with rich text editor
3. Manage post visibility

### For Public Users

1. Browse committee updates on homepage
2. Access events and resources
3. View scholarship information

## 🤝 Contributing

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent ESLint formatting
- Test features thoroughly

---

**Oregon Chapter of ACP** - Excellence in internal medicine.
