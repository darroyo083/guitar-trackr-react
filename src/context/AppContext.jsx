import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null); // Estado para la canción seleccionada
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeSection, setActiveSection] = useState('home');
  const [userSongs, setUserSongs] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserSongs(); // Cargar las canciones del usuario al iniciar la aplicación
    }
  }, [user]);

  const login = async (userData) => {
    const userWithId = {
      user_id: userData.id, // Asegúrate de mapear el campo `id` a `user_id`
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: userData.token,
    };
    setUser(userWithId);
    localStorage.setItem('user', JSON.stringify(userWithId)); // Guardar en localStorage

    // Cargar las canciones del usuario después de que el estado `user` se haya actualizado
    await fetchUserSongs();
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

      // Actualizar el estado de las canciones eliminando la canción añadida
      setSongs((prevSongs) => prevSongs.filter((song) => song.song_id !== songId));

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

  const fetchUserSongs = async () => {
    if (!user || !user.user_id) {
      // Si el usuario no está definido, simplemente retorna sin mostrar alerta
      return;
    }

    try {
      const response = await fetch(`http://localhost:3020/api/users/${user.user_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al obtener las canciones del usuario.');
      }

      const data = await response.json();
      setUserSongs(data.songs); // Extraer solo las canciones del usuario
    } catch (error) {
      console.error(error.message);
      alert('No se pudieron cargar las canciones del usuario.');
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
        removeSongFromUser,
        userSongs,
        fetchUserSongs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}