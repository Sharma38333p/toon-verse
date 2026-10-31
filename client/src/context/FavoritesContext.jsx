import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('toonverse_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('toonverse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cartoon) => {
    const cartoonId = cartoon._id || cartoon.id;
    const exists = favorites.includes(cartoonId);

    setFavorites(prev =>
      exists ? prev.filter(id => id !== cartoonId) : [...prev, cartoonId]
    );
  };

  const isFavorite = (cartoonId) => {
    return favorites.includes(cartoonId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
