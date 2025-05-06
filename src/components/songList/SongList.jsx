import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './SongList.css';

function SongList() {
  const { songs, setSongs, setSelectedSong, addSongToUser, userSongs, user } = useContext(AppContext);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    difficulty: 'easy',
    tuning: '',
    tablature_url: '',
  });
  const [editingSong, setEditingSong] = useState(null); // Estado para la canción que se está editando

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch('http://localhost:3020/api/songs');
      const data = await response.json();
      setSongs(data);
    };

    fetchSongs();
  }, [setSongs]);

  const filteredSongs = songs.filter(
    (song) => !userSongs.some((userSong) => userSong.song_id === song.song_id)
  );

  const handleAddSong = async () => {
    try {
      const response = await fetch('http://localhost:3020/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newSong),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al añadir la canción.');
      }

      const addedSong = await response.json();
      setSongs((prevSongs) => [...prevSongs, addedSong]);
      alert('Canción añadida correctamente.');
      setNewSong({ title: '', artist: '', difficulty: 'easy', tuning: '', tablature_url: '' });
    } catch (error) {
      console.error(error.message);
      alert('No se pudo añadir la canción.');
    }
  };

  const handleDeleteSong = async (songId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta canción?');
    if (!confirmDelete) {
      return; // Si el usuario cancela, no se realiza ninguna acción
    }

    try {
      const response = await fetch(`http://localhost:3020/api/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al eliminar la canción.');
      }

      setSongs((prevSongs) => prevSongs.filter((song) => song.song_id !== songId));
      alert('Canción eliminada correctamente.');
    } catch (error) {
      console.error(error.message);
      alert('No se pudo eliminar la canción.');
    }
  };

  const handleEditSong = (song) => {
    setEditingSong(song); // Establecer la canción que se está editando
  };

  const handleUpdateSong = async () => {
    try {
      const response = await fetch(`http://localhost:3020/api/songs/${editingSong.song_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editingSong),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al actualizar la canción.');
      }

      const updatedSong = await response.json();
      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.song_id === updatedSong.song_id ? updatedSong : song))
      );
      alert('Canción actualizada correctamente.');
      setEditingSong(null); // Salir del modo de edición
    } catch (error) {
      console.error(error.message);
      alert('No se pudo actualizar la canción.');
    }
  };

  return (
    <div>
      <h2>Lista de Canciones</h2>
      {user?.role === 'admin' && (
        <div className="add-song-form">
          <h3>Añadir Canción</h3>
          <input
            type="text"
            placeholder="Título"
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Artista"
            value={newSong.artist}
            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
          />
          <select
            value={newSong.difficulty}
            onChange={(e) => setNewSong({ ...newSong, difficulty: e.target.value })}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
          <input
            type="text"
            placeholder="Afinación"
            value={newSong.tuning}
            onChange={(e) => setNewSong({ ...newSong, tuning: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL de la tablatura"
            value={newSong.tablature_url}
            onChange={(e) => setNewSong({ ...newSong, tablature_url: e.target.value })}
          />
          <button onClick={handleAddSong}>Añadir Canción</button>
        </div>
      )}
      <ul>
        {filteredSongs.map((song) => (
          <li key={song.song_id}>
            <div onClick={() => setSelectedSong(song)}>
              {song.title} - {song.artist}
            </div>
            <button onClick={() => addSongToUser(song.song_id)}>Añadir al repertorio</button>
            {user?.role === 'admin' && (
              <>
                <button onClick={() => handleEditSong(song)}>Editar</button>
                <button onClick={() => handleDeleteSong(song.song_id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {editingSong && (
        <div className="edit-song-form">
          <h3>Editar Canción</h3>
          <input
            type="text"
            placeholder="Título"
            value={editingSong.title}
            onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Artista"
            value={editingSong.artist}
            onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
          />
          <select
            value={editingSong.difficulty}
            onChange={(e) => setEditingSong({ ...editingSong, difficulty: e.target.value })}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
          <input
            type="text"
            placeholder="Afinación"
            value={editingSong.tuning}
            onChange={(e) => setEditingSong({ ...editingSong, tuning: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL de la tablatura"
            value={editingSong.tablature_url}
            onChange={(e) => setEditingSong({ ...editingSong, tablature_url: e.target.value })}
          />
          <button onClick={handleUpdateSong}>Guardar Cambios</button>
          <button onClick={() => setEditingSong(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default SongList;