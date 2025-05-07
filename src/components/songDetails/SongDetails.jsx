import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

function SongDetails() {
  const { selectedSong } = useContext(AppContext);

  if (!selectedSong) {
    return <p>Selecciona una canción de la lista para ver los detalles aquí.</p>;
  }

  return (
    <div>
      <h2>Detalles de la Canción</h2>
      <p><strong>Título:</strong> {selectedSong.title}</p>
      <p><strong>Artista:</strong> {selectedSong.artist}</p>
      <p><strong>Dificultad:</strong> {selectedSong.difficulty}</p>
      <p><strong>Afinación:</strong> {selectedSong.tuning}</p>
      {selectedSong.tablature_url && (
        <p>
          <strong>Tablatura:</strong>{' '}
          <a href={selectedSong.tablature_url} target="_blank" rel="noopener noreferrer">
            Ver tablatura
          </a>
        </p>
      )}
    </div>
  );
}

export default SongDetails;