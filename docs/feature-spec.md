# MySubscriptions Feature Specification

## Project Overview
**MySubscriptions** is a web application that allows users to connect to multiple online services using **OAuth2**, retrieve recent activity, and display a dashboard with **AI-generated summaries, keywords, or sentiment analysis** for each item.  

---

## Features & Acceptance Criteria

### 1. User Authentication via OAuth2
**Description:** Allow users to securely sign in using at least one OAuth2-compatible service.  
**Examples:** GitHub, Google Calendar, Spotify, Reddit, Notion, Dropbox.  

**Acceptance Criteria:**
- [ ] User can click "Sign in" and authenticate via OAuth2.  
- [ ] User session is securely stored (JWT, session, or cookies).  
- [ ] Application handles invalid or expired tokens gracefully.  
- [ ] Logout functionality ends the session.  

**Test Cases:**
- Sign in with a service → redirect back to dashboard → user info is available.  
- Invalid token → display an “Unauthorized” message.  
- Logout → session removed, dashboard inaccessible.  

---

### 2. Fetch & Display User Data
**Description:** Retrieve 10–20 recent items from the connected service.  

**Metadata to Display:**
- Service logo/name  
- Title / name of item  
- Date created/modified  
- Author / source  

**Acceptance Criteria:**
- [ ] Fetch 10–20 items for the authenticated user.  
- [ ] Display service logo and item metadata clearly.  
- [ ] Pagination or lazy loading optional if needed.  

**Test Cases:**
- Connect GitHub → fetch latest repositories/issues → 10–20 items displayed.  
- Metadata fields correctly rendered.  

---

### 3. AI-Powered Processing
**Description:** For each item, generate one or more insights using AI/NLP.  

**Options:**
- Summarization  
- Keyword extraction  
- Sentiment analysis  

**Acceptance Criteria:**
- [ ] AI summary or insight displayed for each item.  
- [ ] Processing handles items without crashing (empty fields).  
- [ ] Optional: user can select type of processing.  

**Test Cases:**
- Check each item → summary generated → displayed on UI.  
- Sentiment analysis displays correct positive/negative/neutral.  
- Keywords show relevant tags.  

---

### 4. User Dashboard
**Description:** Centralized dashboard showing both metadata and AI insights.  

**Acceptance Criteria:**
- [ ] Clean, responsive layout.  
- [ ] Items are grouped by service or sortable.  
- [ ] Optional filters/search functionality.  

**Test Cases:**
- Dashboard renders correctly for multiple services.  
- Items sortable/filterable.  
- Dashboard is responsive on mobile and desktop.  

---

### 5. Optional Enhancements
**Examples:**
- Multiple services connected at once.  
- Keyword visualizations (charts, word clouds).  
- Backend API separation.  
- User-selectable processing type.  

**Acceptance Criteria:**
- [ ] Optional features implemented do not break core functionality.  
- [ ] Visualizations are clear and meaningful.  

**Test Cases:**
- Connect GitHub + Spotify → dashboard displays items from both.  
- Keyword cloud displays top N extracted keywords.  

---

### 6. Future Enhancements
- Plan additional features if given 1/5/20 more days. Examples:
  - Notifications for new items.  
  - AI-generated trends over time.  
  - Export summaries as PDF.  
  - Integration with more services (Reddit, Notion, Google Drive).  

---

## Testing & Validation
- Use **Jest/React Testing Library** for front-end components.  
- Mock OAuth2 responses for integration tests.  
- Mock AI API calls to validate AI processing.  
- Validate that unauthorized users cannot access dashboard.  

---

### Deliverables
1. **Code Repository**: GitHub or GitLab link.  
2. **Hosted Version (preferred)**: Vercel, Netlify, Render, etc.  
3. **Documentation (README.md)**:
   - Setup instructions (`.env.example`)  
   - Architecture & design  
   - AI/NLP implementation  
   - Limitations / next steps  
   - Optional screenshots or demo video  