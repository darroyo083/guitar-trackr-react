import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './Profile.css'; // Archivo CSS para estilos personalizados

function Profile() {
  const { user, logout } = useContext(AppContext);

  if (!user) {
    return (
      <div className="auth-message-container">
        <div className="auth-message-card">
          <h2>Acceso restringido</h2>
          <p>Por favor, inicia sesión para acceder a tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Bienvenido, {user.username} 🎸</h2>
        <div className="profile-info">
          <p><strong>Nombre de usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
        </div>
        <button className="logout-button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;