import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SongDetails from '../songDetails/SongDetails';
import './MySongs.css';

function MySongs() {
  const { user, userSongs, fetchUserSongs, removeSongFromUser, selectedSong, setSelectedSong } = useContext(AppContext);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [tuningFilter, setTuningFilter] = useState('');

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

  const filteredUserSongs = userSongs
    .filter((song) => (difficultyFilter ? song.difficulty === difficultyFilter : true))
    .filter((song) => (artistFilter ? song.artist.toLowerCase().includes(artistFilter.toLowerCase()) : true))
    .filter((song) => (tuningFilter ? song.tuning.toLowerCase().includes(tuningFilter.toLowerCase()) : true));

  return (
    <div className="my-songs-container">
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
        <ul className="song-list">
          {filteredUserSongs.map((song) => (
            <li key={song.song_id} className="song-item">
              <div className="song-item-content" onClick={() => setSelectedSong(song)}>
                <div className="song-item-title">{song.title}</div>
                <div className="song-item-artist">Artista: {song.artist}</div>
                <div className="song-item-hint">Haz clic para ver los detalles</div>
              </div>
              <div className="song-item-actions">
                <button onClick={() => removeSongFromUser(song.song_id)}>Quitar del repertorio</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-songs-details">
        <SongDetails />
      </div>
    </div>
  );
}

export default MySongs;