import { useState } from "react";
import ApiCard from "./components/InsightCard";
import GraficoCard from "./components/GraficoCard";
import { BarChart2 } from "lucide-react";
import { FileText } from "lucide-react";
import { Trash } from "lucide-react";

export default function App() {
  const [cards, setCards] = useState<{ id: number; type: string }[]>([]);

  const addApiCard = () =>
    setCards((prev) => [...prev, { id: Date.now(), type: "api" }]);

  const addGraficoCard = () =>
    setCards((prev) => [...prev, { id: Date.now(), type: "grafico" }]);

  const removeCard = (id: number) =>
    setCards((prev) => prev.filter((card) => card.id !== id));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <header className="flex justify-between items-center w-full max-w-6xl mb-6">
        <h1 className="text-2xl font-bold">📊 IAnalytics Flow</h1>
        <div className="flex gap-2">
          <button
            onClick={addApiCard}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
            <FileText size={18} />
            Elemento de Insights
          </button>
          <button
            onClick={addGraficoCard}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
            <BarChart2 size={18} />
            Elemento Gráfico
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-1 gap-3 w-full max-w-6xl">
        {cards.length === 0 && (
            <p className="text-gray-400 text-sm col-span-3 text-center">
            Nenhum card adicionado ainda. Clique em “Adicionar” para começar.
            </p>
        )}

        {cards.map((card) => (
            <div
            key={card.id}
            className="bg-gray-800 rounded-2xl shadow-lg p-4 transition-all hover:shadow-xl relative"
            >
                {/* Header do Card com botão de deletar */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold text-white">
                    {card.type === "api"
                        ? "Insights"
                        : "Gráfico"}
                    </h2>           
                    <button
                        onClick={() => removeCard(card.id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition-all cursor-pointer"
                        title="Remover card"
                    >
                    <Trash size={16} />
                </button>
                </div>

                {/* Renderização dinâmica dos tipos */}
                {card.type === "api" ? (
                    <ApiCard apiUrl="http://localhost:8000/insight" />
                ) : (
                    <GraficoCard />
                )}
            </div>
            ))}
        </main>
    </div>
  );
}
