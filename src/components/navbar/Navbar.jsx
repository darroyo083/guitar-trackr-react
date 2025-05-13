import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './Navbar.css';

function Navbar() {
  const { user, login, logout, activeSection, setActiveSection } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3020/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Error al iniciar sesión');
      }

      const userData = await response.json();
      login(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Guitar Trackr</div>
      
      {/* Checkbox y label para el menú hamburguesa */}
      <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
      <label htmlFor="navbar-toggle" className="navbar-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>
      
      {/* El contenido que se colapsará en móviles */}
      <div className="navbar-collapse">
        <ul className="navbar-links">
          <li>
            <button
              className={`navbar-button ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              className={`navbar-button ${activeSection === 'songs' ? 'active' : ''}`}
              onClick={() => setActiveSection('songs')}
            >
              Canciones
            </button>
          </li>
          <li>
            <button
              className={`navbar-button ${activeSection === 'my-songs' ? 'active' : ''}`}
              onClick={() => setActiveSection('my-songs')}
            >
              Mis Canciones
            </button>
          </li>
          <li>
            <button
              className={`navbar-button ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              Perfil
            </button>
          </li>
        </ul>
        
        {user ? (
          <div className="user-auth">
            <span className="navbar-user">Hola, {user.username}</span>
            <button className="navbar-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="login-inputs">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="navbar-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="navbar-input"
            />
            <button className="navbar-button" onClick={handleLogin}>
              Login
            </button>
            {error && <p className="navbar-error">{error}</p>}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;