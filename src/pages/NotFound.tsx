
import { Link } from "react-router-dom";
import { VolleyballIcon } from "@/components/Icons";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-volleyball-50/70 to-white p-4">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <VolleyballIcon className="w-12 h-12 text-volleyball-600 mx-auto mb-4" />
        
        <h1 className="text-4xl font-bold mb-4 text-volleyball-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! Parece que esta página está fora da quadra.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-volleyball-600 hover:bg-volleyball-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-volleyball-500 transition-colors"
        >
          Voltar para o jogo
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
