import React from 'react';
import { SearchMusic } from '../component/searchMusic.jsx'; // Asegúrate de que la ruta sea correcta

export const SearchWorldWide = () => {
  return (
    <div className="music-search-container">
      <h2>Busca tu música favorita</h2>
      <SearchMusic />
    </div>
  );
};
