
import { Link } from 'react-router-dom';
import { User } from '@/types';
import { VolleyballIcon } from '@/components/Icons';

interface NavBarProps {
  user: User | null;
  onSignOut: () => void;
}

const NavBar = ({ user, onSignOut }: NavBarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white/70 backdrop-blur-lg shadow-sm border-b border-gray-200/80 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-volleyball-700 transition-transform duration-300 hover:scale-105">
          <VolleyballIcon className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Larik Volei Club</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-sm font-medium px-3 py-2 rounded-lg border border-volleyball-200 text-volleyball-700 hover:bg-volleyball-50 transition-colors duration-200"
                >
                  Admin
                </Link>
              )}
              <div className="text-sm text-volleyball-700 font-medium">
                {user.name}
              </div>
              <button 
                onClick={onSignOut}
                className="text-sm font-medium px-3 py-2 rounded-lg bg-volleyball-100 text-volleyball-700 hover:bg-volleyball-200 transition-colors duration-200"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="text-sm font-medium px-3 py-2 rounded-lg bg-volleyball-100 text-volleyball-700 hover:bg-volleyball-200 transition-colors duration-200"
              >
                Entrar
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium px-3 py-2 rounded-lg bg-volleyball-600 text-white hover:bg-volleyball-700 transition-colors duration-200"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
