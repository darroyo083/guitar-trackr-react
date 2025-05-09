import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SongDetails from '../songDetails/SongDetails';
import './MySongs.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
  duration: 700,
   easing: 'ease-in-out-back',
   offset: 100,
   anchorPlacement: 'top-top',
   delay: 0,
  mirror: true
});

function MySongs() {
  const { user, userSongs, fetchUserSongs, removeSongFromUser, selectedSong, setSelectedSong } = useContext(AppContext);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [tuningFilter, setTuningFilter] = useState('');
  const [mobileDetailsView, setMobileDetailsView] = useState(false); // Estado para mostrar/ocultar detalles en móvil

  useEffect(() => {
    if (user) {
      fetchUserSongs();
    }
  }, [user, fetchUserSongs]);

  if (!user) {
    return (
      <div className="auth-message-container">
        <div className="auth-message-card">
          <h2>Acceso restringido</h2>
          <p>Por favor, inicia sesión para ver tus canciones.</p>
        </div>
      </div>
    );
  }

  // Función para manejar la selección de una canción en móvil
  const handleSongSelect = (song) => {
    setSelectedSong(song);
    // En pantallas pequeñas, mostrar vista de detalles
    if (window.innerWidth <= 768) {
      setMobileDetailsView(true);
    }
  };

  // Función para volver a la lista desde la vista de detalles
  const handleBackToList = () => {
    setMobileDetailsView(false);
  };

  const filteredUserSongs = userSongs
    .filter((song) => (difficultyFilter ? song.difficulty === difficultyFilter : true))
    .filter((song) => (artistFilter ? song.artist.toLowerCase().includes(artistFilter.toLowerCase()) : true))
    .filter((song) => (tuningFilter ? song.tuning.toLowerCase().includes(tuningFilter.toLowerCase()) : true));

  return (
    <div className="my-songs-container">
      {/* Vista móvil: Detalles de la canción */}
      {mobileDetailsView ? (
        <div className="mobile-details-view">
          <button className="back-to-list-button" onClick={handleBackToList}>
            ← Volver a la lista
          </button>
          <SongDetails />
        </div>
      ) : (
        /* Vista normal: Lista de canciones */
        <div className="my-songs-list">
          <h2>Mis Canciones</h2>
          <div className="filter-section">
            <label htmlFor="difficulty-filter">Filtrar por dificultad:</label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          <div className="filter-section">
            <label htmlFor="artist-filter">Buscar por artista:</label>
            <input
              id="artist-filter"
              type="text"
              placeholder="Nombre del artista"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <label htmlFor="tuning-filter">Buscar por afinación:</label>
            <input
              id="tuning-filter"
              type="text"
              placeholder="Afinación"
              value={tuningFilter}
              onChange={(e) => setTuningFilter(e.target.value)}
            />
          </div>
          
          {filteredUserSongs.length === 0 ? (
            <div className="empty-songs-message">
              <p>No tienes canciones en tu repertorio. ¡Añade algunas desde la lista de canciones!</p>
            </div>
          ) : (
            <ul className="song-list">
              {filteredUserSongs.map((song) => (
                <li data-aos="fade-right" key={song.song_id} id="song-elem" className="song-item">
                  <div className="song-item-content" onClick={() => handleSongSelect(song)}>
                    <div className="song-item-title">{song.title}</div>
                    <div className="song-item-artist">Artista: {song.artist}</div>
                    <div className="song-item-hint">Haz clic para ver los detalles</div>
                  </div>
                  <div className="song-item-actions">
                    <button onClick={(e) => { e.stopPropagation(); removeSongFromUser(song.song_id); }}>
                      Quitar del repertorio
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Columna derecha: Detalles de la canción (solo visible en desktop) */}
      <div className="my-songs-details desktop-only">
        <SongDetails />
      </div>
    </div>
  );
}

export default MySongs;