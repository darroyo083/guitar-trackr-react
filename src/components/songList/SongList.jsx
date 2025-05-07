import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './SongList.css';
import '../mySongs/MySongs.css'; // Importar los estilos de "Mis Canciones"

function SongList() {
  const { songs, setSongs, setSelectedSong, addSongToUser, userSongs, user } = useContext(AppContext);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [tuningFilter, setTuningFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controlar si el formulario de edición está visible
  const [editingSong, setEditingSong] = useState(null); // Almacenar la canción que se está editando

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch('http://localhost:3020/api/songs');
      const data = await response.json();
      setSongs(data);
    };

    fetchSongs();
  }, [setSongs]);

  const filteredSongs = songs
    .filter((song) => !userSongs.some((userSong) => userSong.song_id === song.song_id))
    .filter((song) => (difficultyFilter ? song.difficulty === difficultyFilter : true))
    .filter((song) => (artistFilter ? song.artist.toLowerCase().includes(artistFilter.toLowerCase()) : true))
    .filter((song) => (tuningFilter ? song.tuning.toLowerCase().includes(tuningFilter.toLowerCase()) : true));

  const handleEditSong = (song) => {
    setEditingSong(song); // Establecer la canción que se está editando
    setIsEditing(true); // Mostrar el formulario de edición
  };

  const handleSaveEdit = async () => {
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
        throw new Error(error || 'Error al editar la canción.');
      }

      const updatedData = await response.json();
      setSongs((prevSongs) =>
        prevSongs.map((s) => (s.song_id === updatedData.song_id ? updatedData : s))
      );

      alert('Canción editada correctamente.');
      setIsEditing(false); // Ocultar el formulario de edición
    } catch (error) {
      console.error(error.message);
      alert('No se pudo editar la canción.');
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

  return (
    <div>
      <h2>Lista de Canciones</h2>
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
        {filteredSongs.map((song) => (
          <li key={song.song_id} className="song-item">
            <div className="song-item-content" onClick={() => setSelectedSong(song)}>
              <div className="song-item-title">{song.title}</div>
              <div className="song-item-artist">Artista: {song.artist}</div>
              <div className="song-item-hint">Haz clic para ver los detalles</div>
            </div>
            <div className="song-item-actions">
              <button onClick={(e) => { e.stopPropagation(); addSongToUser(song.song_id); }}>Añadir al repertorio</button>
              {user?.role === 'admin' && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handleEditSong(song); }}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSong(song.song_id); }}>Eliminar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
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
            <button onClick={handleSaveEdit}>Guardar Cambios</button>
            <button onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongList;