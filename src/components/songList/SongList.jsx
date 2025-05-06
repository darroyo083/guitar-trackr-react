import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function SongList() {
  const { songs, setSongs, setSelectedSong, addSongToUser, userSongs } = useContext(AppContext);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch('http://localhost:3020/api/songs');
      const data = await response.json();
      setSongs(data);
    };

    fetchSongs();
  }, [setSongs]);

  // Filtrar canciones que no están en la lista del usuario
  const filteredSongs = songs.filter(
    (song) => !userSongs.some((userSong) => userSong.song_id === song.song_id)
  );

  return (
    <div>
      <h2>Lista de Canciones</h2>
      <ul>
        {filteredSongs.map((song) => (
          <li key={song.song_id}>
            <div onClick={() => setSelectedSong(song)}>
              {song.title} - {song.artist}
            </div>
            <button onClick={() => addSongToUser(song.song_id)}>Añadir al repertorio</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;