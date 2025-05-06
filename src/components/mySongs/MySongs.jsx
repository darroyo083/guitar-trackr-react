import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import SongDetails from '../songDetails/SongDetails';

function MySongs() {
  const { userSongs, fetchUserSongs, removeSongFromUser, selectedSong, setSelectedSong } = useContext(AppContext);

  useEffect(() => {
    fetchUserSongs(); // Cargar las canciones del usuario al montar el componente
  }, [fetchUserSongs]);

  return (
    <div>
      <h2>Mis Canciones</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <ul style={{ flex: 1 }}>
          {userSongs.map((song) => (
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