import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SongDetails from '../songDetails/SongDetails';

function MySongs() {
  const { user, userSongs, fetchUserSongs, removeSongFromUser, selectedSong, setSelectedSong } = useContext(AppContext);
  const [difficultyFilter, setDifficultyFilter] = useState(''); // Filtro por dificultad
  const [artistFilter, setArtistFilter] = useState(''); // Filtro por artista
  const [tuningFilter, setTuningFilter] = useState(''); // Filtro por afinación

  useEffect(() => {
    if (user) {
      fetchUserSongs(); // Cargar las canciones del usuario al montar el componente
    }
  }, [user, fetchUserSongs]);

  if (!user) {
    return <p>No estás autenticado. Por favor, inicia sesión.</p>;
  }

  const filteredUserSongs = userSongs
    .filter((song) => (difficultyFilter ? song.difficulty === difficultyFilter : true)) // Filtrar por dificultad
    .filter((song) => (artistFilter ? song.artist.toLowerCase().includes(artistFilter.toLowerCase()) : true)) // Filtrar por artista
    .filter((song) => (tuningFilter ? song.tuning.toLowerCase().includes(tuningFilter.toLowerCase()) : true)); // Filtrar por afinación

  return (
    <div>
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
      <div style={{ display: 'flex', gap: '2rem' }}>
        <ul style={{ flex: 1 }}>
          {filteredUserSongs.map((song) => (
            <li key={song.song_id} style={{ marginBottom: '1rem' }}>
              <div onClick={() => setSelectedSong(song)} style={{ cursor: 'pointer' }}>
                {song.title} - {song.artist}
              </div>
              <button onClick={() => removeSongFromUser(song.song_id)}>Quitar del repertorio</button>
            </li>
          ))}
        </ul>
        <div style={{ flex: 1 }}>
          <SongDetails />
        </div>
      </div>
    </div>
  );
}

export default MySongs;