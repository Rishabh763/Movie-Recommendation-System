// src/utils/bookmarkService.js
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const toggleBookmarkInDB = async (userId, movie, isCurrentlyBookmarked) => {
  const docRef = doc(db, "users", userId, "bookmarks", movie.title);

  try {
    if (isCurrentlyBookmarked) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        title: movie.title,
        category: movie.category,
        year: movie.year,
        rating: movie.rating,
        thumbnail: movie.thumbnail,
        isTrending: movie.isTrending || false,
      });
    }
  } catch (error) {
    console.error("Firestore Bookmark Error:", error);
  }
};
