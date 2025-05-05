import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

function Profile() {
  const { user } = useContext(AppContext);

  if (!user) {
    return <p>No estás autenticado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p><strong>Nombre de usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
    </div>
  );
}

export default Profile;