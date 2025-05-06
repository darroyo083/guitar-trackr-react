import Navbar from './components/navbar/Navbar';
import Header from './components/header/Header';
import SongList from './components/songList/SongList';
import SongDetails from './components/songDetails/SongDetails';
import Profile from './components/profile/Profile';
import MySongs from './components/mySongs/MySongs';
import { AppProvider, AppContext } from './context/AppContext';
import { useContext } from 'react';

function AppContent() {
  const { activeSection } = useContext(AppContext);

  return (
    <div>
      <Navbar />
      <Header />
      <p>¡Bienvenido a la aplicación Guitar Trackr!</p>
      {activeSection === 'home' && <p>Esta es la página de inicio.</p>}
      {activeSection === 'songs' && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <SongList />
          <SongDetails />
        </div>
      )}
      {activeSection === 'my-songs' && <MySongs />}
      {activeSection === 'profile' && <Profile />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
