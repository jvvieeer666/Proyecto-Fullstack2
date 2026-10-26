import { useState } from 'react';
import { useNavigate } from 'react-router'; // 👈 Sin -dom

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      const usuarioFalso = { nombre: email.split('@')[0], email: email };
      localStorage.setItem('usuario', JSON.stringify(usuarioFalso));
      navigate('/');
      window.location.reload();
    } else {
      alert("Por favor, llena ambos campos");
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <input type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;