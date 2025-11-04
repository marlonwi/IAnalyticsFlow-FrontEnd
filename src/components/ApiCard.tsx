import React, { useState } from 'react';
import MarkdownCard from './MarkdownCard';

interface ApiCardProps {
  apiUrl: string; // URL da API local
}

const ApiCard: React.FC<ApiCardProps> = ({ apiUrl }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?prompt=${encodeURIComponent(query)}`);
      console.log(apiUrl)
      if (!response.ok) throw new Error('Erro na API');

      const text = await response.text(); // retorna como texto puro
      setResult(text);
    } catch (err) {
      console.log(err);
      setError('Falha ao consultar os dados. Por gentileza, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // 📁 Função para exportar o resultado em arquivo .txt
  const exportarTxt = () => {
    if (!result) return;

    const blob = new Blob([result.replace(/\\n/g, '\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const fileName = `insight_${query.replace(/\s+/g, '_') || 'resultado'}.md`;
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-lg md:w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Informe o que deseja saber, como tomar decisões ou relatórios"
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
        >
          Buscar
        </button>
      </div>

      <div>
        {loading && <p className="text-gray-400">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {result && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{query}</h2>
            <MarkdownCard text={result.replace(/\\n/g, '\n')} />

            {/* 📤 Botão de exportar insights */}
            <div className="mt-4">
              <button
                onClick={exportarTxt}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-all"
              >
                📄 Exportar Insights
              </button>
            </div>
          </div>
        )}

        {!loading && !result && !error && (
          <p className="text-gray-400 text-sm">Nenhum resultado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default ApiCard;
