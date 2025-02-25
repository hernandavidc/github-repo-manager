import { RepoFav } from "@/types/repos";
import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<RepoFav[]>([]);

  useEffect(() => {
    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => setFavorites(data));
  }, []);

  const toggleFavorite = async (repoId: string, repoName: string, repoUrl: string) => {
    const isFavorite = favorites.some(fav => fav.repoId === repoId);

    if (isFavorite) {
      await fetch("/api/favorites", {
        method: "DELETE",
        body: JSON.stringify({ repoId }),
        headers: { "Content-Type": "application/json" },
      });
      setFavorites(favorites.filter(fav => fav.repoId !== repoId));
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ repoId, repoName, repoUrl }),
        headers: { "Content-Type": "application/json" },
      });
      setFavorites([...favorites, { repoId, repoName, repoUrl }]);
    }
  };

  return { favorites, toggleFavorite };
}
