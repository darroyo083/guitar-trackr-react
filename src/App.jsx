import Navbar from './components/navbar/Navbar';
import Header from './components/header/Header';
import SongList from './components/songList/SongList';
import SongDetails from './components/songDetails/SongDetails';
import Profile from './components/profile/Profile';
import MySongs from './components/mySongs/MySongs';
import Footer from './components/footer/Footer';
import ThemeToggle from './components/themeToggle/ThemeToggle'; // Importa el componente
import { AppProvider, AppContext } from './context/AppContext';
import { useContext } from 'react';
import "./App.css";

function AppContent() {
  const { activeSection, setActiveSection } = useContext(AppContext);

  return (
    <div className="app-container">
      <Navbar />
      <Header />
      <main className="main-content">
        {activeSection === 'home' && (
          <div className="home-container">
            <div className="home-hero">
              <h1>🎸 Guitar Trackr</h1>
              <p>
                ¡Bienvenido a Guitar Trackr! Una aplicación diseñada para ayudarte a gestionar tus canciones de guitarra
                y explorar nuevas canciones para aprender.
              </p>
              <button className="cta-button" onClick={() => setActiveSection('songs')}>
                Explorar Canciones
              </button>
            </div>
            <div className="home-features">
              <div className="feature-card">
                <h3>🎵 Gestiona tus canciones</h3>
                <p>Organiza tus canciones favoritas y lleva un seguimiento de tu progreso.</p>
              </div>
              <div className="feature-card">
                <h3>🔍 Explora nuevas canciones</h3>
                <p>Descubre canciones por dificultad, afinación y más.</p>
              </div>
              <div className="feature-card">
                <h3>👤 Perfil personalizado</h3>
                <p>Accede a tu perfil y gestiona tu repertorio de canciones.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'songs' && <SongList />}
        {activeSection === 'my-songs' && <MySongs />}
        {activeSection === 'profile' && <Profile />}
      </main>
      <Footer />
      <ThemeToggle /> {/* Añade el botón de cambio de tema */}
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
