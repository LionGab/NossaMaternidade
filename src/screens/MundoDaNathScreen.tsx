import { ShoppingBag, Award, Map, ArrowRight } from 'lucide-react-native';

export function MundoDaNathScreen() {
  return (
    <div className="flex flex-col pb-24 bg-white min-h-full">
      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Mundo da Nath</h1>
      </div>

      {/* Loja Card */}
      <div className="mx-5 mb-6 rounded-3xl overflow-hidden h-64 relative bg-gray-900 shadow-xl shadow-purple-500/10 group cursor-pointer">
        <img
          src="https://i.imgur.com/tNIrNIs.jpg"
          alt="Loja Exclusiva"
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <ShoppingBag className="text-white mb-3" size={24} />
          <h2 className="text-2xl font-bold text-white mb-1">Loja Exclusiva</h2>
          <p className="text-sm text-gray-200">Confira os produtos oficiais</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Africa */}
        <div className="rounded-3xl p-6 bg-blue-50 border border-blue-100 flex flex-col h-40 justify-between relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200/50 rounded-full blur-2xl group-hover:bg-blue-300/50 transition-colors" />
          
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Map size={20} />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900">Projeto África</h3>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-2">
              Saiba mais <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Courses */}
        <div className="rounded-3xl p-6 bg-purple-50 border border-purple-100 flex flex-col h-40 justify-between relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-200/50 rounded-full blur-2xl group-hover:bg-purple-300/50 transition-colors" />
          
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Award size={20} />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900">Cursos & Mentorias</h3>
            <button className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-2">
              Acessar agora <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
