import { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const [activeSection, setActiveSection] = useState('home'); // Estado para la sección activa

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Eliminar del localStorage
  };

  const addSongToUser = async (songId) => {
    if (!user) {
      alert('Debes iniciar sesión para añadir canciones.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3020/api/songs/${songId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al añadir la canción.');
      }

      alert('Canción añadida a tu repertorio.');
    } catch (error) {
      console.error(error.message);
      alert('No se pudo añadir la canción.');
    }
  };

  const removeSongFromUser = async (songId) => {
    if (!user) {
      alert('Debes iniciar sesión para quitar canciones.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3020/api/songs/${songId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al quitar la canción.');
      }

      alert('Canción eliminada de tu repertorio.');
    } catch (error) {
      console.error(error.message);
      alert('No se pudo quitar la canción.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        songs,
        setSongs,
        selectedSong,
        setSelectedSong,
        user,
        login,
        logout,
        activeSection,
        setActiveSection,
        addSongToUser,
        removeSongFromUser, // Añadir la función al contexto
      }}
    >
      {children}
    </AppContext.Provider>
  );
}