# 🎬 Movie Recommendation Web App

A personalized movie recommendation web application built using **React**, **Tailwind CSS**, and **Firebase**. Users can sign in via Google, rate movies on a 5-star scale, bookmark favorites, and receive tailored recommendations based on their preferences.

---

## 🚀 Features

- 🔐 **Google Sign-In** with Firebase Authentication
- 🎥 **Movie Catalog** loaded from JSON with responsive thumbnails
- ⭐ **5-Star Rating System** for each movie
- 🔖 **Bookmark Movies** for later viewing
- 🔄 **Randomized Movie Order** per user to ensure fair exposure
- 💾 **Persistent Storage** using Firestore and LocalStorage
- 🎨 **Modern UI** using Tailwind CSS and Lucide Icons

---

## 🧠 Technologies Used


### Frontend:
- React (Context API, Hooks)
- Tailwind CSS
- Lucide-react for icons

### Backend / Services:
- Firebase Authentication (Google Sign-In)
- Firebase Firestore for user-specific data
- LocalStorage for client-side persistence

---

## 📁 Project Structure

src/ \
│ \
├── components/ \
│ └── MovieCard.jsx           # Displays each movie with its poster, year, category, rating, bookmark toggle, and 5-star rating system \
│ └── TrendingCard.jsx        # Displays trending movies in a special layout, highlighting visual appeal \
│ └── Navbar.jsx              # Top navigation bar with logo, search functionality, and user profile/login icon \
│ └── SidebarIcon.jsx         # Sidebar icons for navigating between pages like Home, Movies, TV Series, Bookmarked \
│ └── ScrollToTop.jsx         # Scrolls to top automatically when a user changes routes \
│ └── Login.jsx               # Handles Google Sign-In using Firebase Authentication \
│ \
├── Pages/ \
│ └── Layout.jsx              # Common layout wrapper including navbar and sidebar for consistent structure \
│ └── MainContent.jsx         # Displays all movies in shuffled order allowing users to rate and bookmark \
│ └── Recommendation.jsx      # Personalized movie recommendation page based on user ratings \
│ └── Bookmarked.jsx          # Displays list of movies that the user has bookmarked \
│ └── Nopage.jsx              # 404 page for undefined routes \
│ \
├── Context/ \
│ └── BookmarkContext.jsx     # Manages global movie state: bookmarks, ratings, shuffling, localStorage sync \
│ └── AuthContext.jsx         # Manages global authentication state and user Firestore data \
│ \
├── firebase.js               # Firebase project configuration and app initialization (Auth + Firestore) \
├── data.json                 # Static JSON dataset of movies with metadata like title, year, thumbnails, etc. \
└── App.jsx                   # Main component setting up React Router, routes, and wrapping with providers \



---

## 📸 Screenshots

| Home Page | Recommendation Page | Bookmarked Movie & TV series |
|----------|------------|------------|
| ![Home](./screenshots/home.png) | ![Recommendations](./screenshots/Recommendation.png) | ![Card](./screenshots/card.png) | 

---

## 🛠️ Installation

### Prerequisites:
- Node.js v14+
- Firebase project with Firestore and Authentication enabled

### Setup Instructions:

1. **Clone the repository**

git clone https://github.com/Rishabh763/Movie-Recommendation-System.git
cd movie-recommender-app

2. **Install dependencies**

```bash
npm install
```

3. **Firebase Setup**

Create a Firebase project.
Enable Google Sign-In in Authentication.
Create a Firestore Database.
Get your Firebase config and update firebase/firebase.js:

```bash
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  ...
};
```

3. **Run the development server**

```bash
npm run dev
```

## 🔄 Future Improvements
- Add real-time recommendations using Flask backend or ML model
- Search and filter functionality by genre/year/trending
- Admin dashboard to manage movie data
- User analytics dashboard (watch history, rating behavior)

## ✨ Credits

Created by Rishabh Singh

B.Tech CSE(ICB)  @D.J. Sanghvi College of Engineering