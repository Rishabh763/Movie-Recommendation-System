# 🎬 Movie Recommendation Web App

A full-stack movie recommender over the **MovieLens 32M** dataset. Sign in with Google, rate
movies, and get personalised recommendations from models trained on 32 million ratings, with
a "because you liked…" explanation and a predicted star rating for every pick.

**Live:** https://movie-recommendation-system-alpha-nine.vercel.app ·
**API + models:** [Movie-Recommendation-System-Backend](https://github.com/Rishabh763/Movie-Recommendation-System-Backend)

---

## 🚀 Features

- 🎥 **23,350-movie catalog** (every MovieLens 32M title with at least 20 ratings) with TMDB posters and overviews
- 🔎 **Search, genre filter and sorting** (popularity, rating, year, title), paginated server-side
- ⭐ **Ratings and bookmarks** stored per user in Firestore
- 🎯 **Personalised recommendations** from an implicit-feedback ALS model, computed for each user on request from their ratings
- 💡 **Explanations**: each pick shows the movie you rated that it is most similar to, plus a predicted star rating from a biased matrix-factorisation model
- 🧊 **Cold start**: new users see popular movies and an onboarding grid; with 1–3 ratings the model blends in genre preferences
- 🎞️ **Movie pages** with overview and "More like this" (nearest neighbours in the learned item embedding)
- 🔐 **Google Sign-In**; every API call carries a Firebase ID token the backend verifies

## 📊 Model results

Offline evaluation on a per-user temporal split (each user's latest 20% of ratings held out).
Full table, methodology and tuning in the
[backend README](https://github.com/Rishabh763/Movie-Recommendation-System-Backend#results).

---

## 🧠 Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS 4, Framer Motion, Vite |
| Backend | Flask, NumPy, pandas (serving); implicit, Numba, SciPy (training) |
| Data | MovieLens 32M (ratings), TMDB API (posters, overviews) |
| Auth and storage | Firebase Authentication (Google), Cloud Firestore |
| Hosting | Vercel (frontend), Render (backend) |

## 📁 Project structure

```
src/
├── api.js                     # Backend client: catalog, movie details, posters, recommendations
├── Context/
│   ├── AuthContext.jsx        # Google sign-in / sign-out
│   └── LibraryContext.jsx     # The user's ratings and bookmarks (Firestore, atomic field updates)
├── Components/
│   ├── MovieCard.jsx          # Poster card + Poster, StarRating, BookmarkButton
│   ├── Navbar.jsx, SidebarIcon.jsx, SkeletonCard.jsx, Login.jsx, ProtectedRoute.jsx, ScrollToTop.jsx
├── Pages/
│   ├── MainContent.jsx        # Browse: search, genre, sort, load more
│   ├── Recommendation.jsx     # Recommendations, strategy note, onboarding grid
│   ├── MovieDetail.jsx        # Overview, your rating, similar movies
│   ├── Bookedmark.jsx         # Bookmarked movies
│   ├── Layout.jsx             # Shell + TMDB / MovieLens attribution
│   └── Nopage.jsx
└── App.jsx                    # Routes
```

## 🛠️ Run locally

```bash
git clone https://github.com/Rishabh763/Movie-Recommendation-System.git
cd Movie-Recommendation-System
npm install
```

Create `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
# Optional: use a local backend instead of the deployed one
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

## 🙏 Credits

Built by **Rishabh Singh**.

- Ratings: F. Maxwell Harper and Joseph A. Konstan. 2015. *The MovieLens Datasets: History and Context.* ACM TiiS 5(4). [GroupLens](https://grouplens.org/datasets/movielens/)
- Posters and overviews: [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
