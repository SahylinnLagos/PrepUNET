import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, GraduationCap, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">PrepUNET</h1>
              <p className="text-xs text-blue-200">Plataforma de Preparadores</p>
            </div>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={user.img} alt="Imagen" width={50} height={50} style={{borderRadius:'50%'}} />
                <div className="text-right">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-blue-200 capitalize">{user.role}</p>
                </div>
              </div>
              <Link
                to="/PrepUNET/profile"
                className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Perfil</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/PrepUNET/login"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/PrepUNET/register"
                className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;