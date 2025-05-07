import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SongDetails from '../songDetails/SongDetails';
import './SongList.css';
import '../mySongs/MySongs.css'; // Reutilizar estilos de "Mis Canciones"

function SongList() {
  const { songs, setSongs, setSelectedSong, addSongToUser, userSongs, user } = useContext(AppContext);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [tuningFilter, setTuningFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controlar si el formulario de edición está visible
  const [isAdding, setIsAdding] = useState(false); // Controlar si el modal de añadir canción está visible
  const [editingSong, setEditingSong] = useState(null); // Almacenar la canción que se está editando
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    difficulty: 'easy',
    tuning: '',
    tablature_url: '',
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:3020/api/songs');
        if (!response.ok) {
          throw new Error('Error al cargar las canciones.');
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error al cargar las canciones:', error.message);
      }
    };

    fetchSongs();
  }, [setSongs]);

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') {
      alert('Solo los administradores pueden añadir canciones.');
      return;
    }

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
      setNewSong({ title: '', artist: '', difficulty: 'easy', tuning: '', tablature_url: '' });
      setIsAdding(false); // Cerrar el modal
      alert('Canción añadida correctamente.');
    } catch (error) {
      console.error(error.message);
      alert('No se pudo añadir la canción.');
    }
  };

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

  const filteredSongs = songs
    .filter((song) => !userSongs.some((userSong) => userSong.song_id === song.song_id))
    .filter((song) => (difficultyFilter ? song.difficulty === difficultyFilter : true))
    .filter((song) => (artistFilter ? song.artist.toLowerCase().includes(artistFilter.toLowerCase()) : true))
    .filter((song) => (tuningFilter ? song.tuning.toLowerCase().includes(tuningFilter.toLowerCase()) : true));

  return (
    <div className="my-songs-container">
      

      {/* Columna izquierda: Lista de canciones */}
      <div className="my-songs-list">
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

      {/* Botón para añadir nueva canción */}
      {user?.role === 'admin' && (
        <button className="add-song-button" onClick={() => setIsAdding(true)}>
          Añadir Nueva Canción
        </button>
      )}

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
      </div>

      {/* Columna derecha: Detalles de la canción */}
      <div className="my-songs-details">
        <SongDetails />
      </div>

      {/* Modal para añadir nueva canción */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Añadir Nueva Canción</h3>
            <form onSubmit={handleAddSong}>
              <input
                type="text"
                placeholder="Título"
                value={newSong.title}
                onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Artista"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                required
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
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsAdding(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar canción */}
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