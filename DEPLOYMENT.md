# Deployment Guide

## Deploy to Vercel

### Prerequisites
1. GitHub repository with your Huddle app code
2. Vercel account (free at vercel.com)
3. Firebase project set up with Authentication and Firestore
4. Google Maps API key with proper restrictions

### Step 1: Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### Step 2: Configure Environment Variables
In your Vercel project settings, add these environment variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

**Important**: The Google Maps API key is now server-side only (no NEXT_PUBLIC_ prefix) for security.

### Step 3: Secure Your Google Maps API Key
1. In Google Cloud Console, go to APIs & Services > Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domains:
   - `localhost:3000/*` (for development)
   - `your-app-name.vercel.app/*` (for production)
   - `*.vercel.app/*` (for preview deployments)

### Step 4: Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

### Step 5: Configure Firebase for Production
1. In Firebase Console, go to Authentication > Settings
2. Add your Vercel domain to "Authorized domains"
3. Deploy your Firestore security rules:
   \`\`\`bash
   firebase deploy --only firestore:rules
   \`\`\`

### Step 6: Enable Google Sign-in
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google provider
3. Add your Vercel domain to authorized domains

## Post-Deployment Checklist
- [ ] Test authentication (email/password and Google)
- [ ] Test event creation and RSVP
- [ ] Test Google Maps integration
- [ ] Test real-time chat functionality
- [ ] Verify Firestore security rules are active
- [ ] Test on mobile devices
- [ ] Verify API key restrictions are working

## Security Notes
- Google Maps API key is now secured server-side and only accessible to authenticated users
- API key is never exposed in the client bundle
- Security is enforced through server-side authentication checks
- Always set up proper domain restrictions in Google Cloud Console

## Troubleshooting
- **Firebase errors**: Check environment variables are correctly set
- **Google Maps not loading**: Verify API key is set as GOOGLE_MAPS_API_KEY (without NEXT_PUBLIC_)
- **Authentication issues**: Ensure domains are authorized in Firebase
- **Build failures**: Check Next.js configuration and dependencies
- **Maps config errors**: Ensure user is authenticated before accessing maps
