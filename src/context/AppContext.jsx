import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  
  // Recuperar el usuario del localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Recuperar la sección activa del localStorage
  const [activeSection, setActiveSection] = useState(() => {
    const storedSection = localStorage.getItem('activeSection');
    return storedSection || 'home';
  });
  
  const [userSongs, setUserSongs] = useState([]);

  // Guardar la sección activa en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (user) {
      fetchUserSongs();
    }
  }, [user]);

  const login = async (userData) => {
    const userWithId = {
      user_id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: userData.token,
    };
    setUser(userWithId);
    localStorage.setItem('user', JSON.stringify(userWithId));

    await fetchUserSongs();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // No eliminamos activeSection al cerrar sesión
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
      
      // Actualizar las canciones del usuario
      await fetchUserSongs();

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

      // Actualizar las canciones del usuario
      setUserSongs((prevSongs) => prevSongs.filter((song) => song.song_id !== songId));

      alert('Canción eliminada de tu repertorio.');
    } catch (error) {
      console.error(error.message);
      alert('No se pudo quitar la canción.');
    }
  };

  const fetchUserSongs = async () => {
    if (!user || !user.user_id) {
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
      setUserSongs(data.songs);
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