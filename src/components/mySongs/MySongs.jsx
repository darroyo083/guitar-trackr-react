import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function MySongs() {
  const { userSongs, fetchUserSongs, removeSongFromUser } = useContext(AppContext);

  useEffect(() => {
    fetchUserSongs(); // Cargar las canciones del usuario al montar el componente
  }, [fetchUserSongs]);

  return (
    <div>
      <h2>Mis Canciones</h2>
      <ul>
        {userSongs.map((song) => (
          <li key={song.song_id}>
            <div>
              {song.title} - {song.artist}
            </div>
            <button onClick={() => removeSongFromUser(song.song_id)}>Quitar del repertorio</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MySongs;