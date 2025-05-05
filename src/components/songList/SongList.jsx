import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function SongList() {
  const { songs, setSongs, setSelectedSong, addSongToUser, removeSongFromUser } = useContext(AppContext);

  useEffect(() => {
    // Simular una llamada a la API para obtener las canciones
    const fetchSongs = async () => {
      const response = await fetch('http://localhost:3020/api/songs');
      const data = await response.json();
      setSongs(data);
    };

    fetchSongs();
  }, [setSongs]);

  return (
    <div>
      <h2>Lista de Canciones</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.song_id}>
            <div onClick={() => setSelectedSong(song)}>
              {song.title} - {song.artist}
            </div>
            <button onClick={() => addSongToUser(song.song_id)}>Añadir al repertorio</button>
            <button onClick={() => removeSongFromUser(song.song_id)}>Quitar del repertorio</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;