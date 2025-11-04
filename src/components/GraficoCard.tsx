import { useState, useRef } from "react";
import {
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  ComposedChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import * as htmlToImage from "html-to-image";

const COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#84CC16"
];

interface ChartConfig {
  chartType: string;
  xFields: string[] | string;
  yFields: string[] | string;
  title: string;
}

interface ApiResponse {
  columns: string[];
  rows: Record<string, any>[];
  config: ChartConfig;
}

export default function GraficoCard() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Record<string, any>[] | null>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    setConfig(null);

    try {
      const response = await fetch(`http://localhost:8000/chart?prompt=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Falha ao consultar dados. Tente novamente");
      const json: ApiResponse = await response.json();

      const xFieldArray = Array.isArray(json.config.xFields) ? json.config.xFields : [json.config.xFields];
      const numericData = json.rows.map(row => {
        const newRow: Record<string, any> = {};
        xFieldArray.forEach(f => {
          newRow[f] = isNaN(Number(row[f])) ? row[f] : Number(row[f]);
        });
        json.config.yFields instanceof Array
          ? json.config.yFields.forEach((f: string) => newRow[f] = Number(row[f]))
          : newRow[json.config.yFields as string] = Number(row[json.config.yFields as string]);
        newRow["__xKey__"] = xFieldArray.map(f => row[f]).join(" - ");
        return newRow;
      });

      setData(numericData);
      setConfig(json.config);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-2 rounded-lg text-sm text-white shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-gray-300">
              {entry.name}: <span className="font-bold">{Number(entry.value).toLocaleString("pt-BR")}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleKey = (key: string) => {
    setHiddenKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const downloadChart = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);
      const link = document.createElement("a");
      link.download = `${config?.title || "grafico"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
    }
  };

  const renderChart = () => {
    if (!data || !config) return null;
    const yFieldList = Array.isArray(config.yFields) ? config.yFields : [config.yFields];
    const visibleFields = yFieldList.filter(f => !hiddenKeys.includes(f));

    switch (config.chartType) {
      case "BarChart":
        return (
          <BarChart data={data}>
            <XAxis dataKey="__xKey__" />
            <YAxis width={80} tickFormatter={(v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v.toLocaleString()} />
            <Tooltip content={<CustomTooltip />} />
            <Legend onClick={(e: any) => toggleKey(e.dataKey)} wrapperStyle={{ cursor: "pointer" }} />
            {visibleFields.map((field, i) => (
              <Bar key={field} dataKey={field} fill={COLORS[i % COLORS.length]} radius={6} />
            ))}
          </BarChart>
        );

      case "LineChart":
        return (
          <LineChart data={data}>
            <XAxis dataKey="__xKey__" />
            <YAxis width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend onClick={(e: any) => toggleKey(e.dataKey)} />
            {visibleFields.map((field, i) => (
              <Line key={field} type="monotone" dataKey={field} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        );

      case "PieChart":
        return (
          <PieChart>
            <Pie data={data} dataKey={visibleFields[0]} nameKey="__xKey__" cx="50%" cy="50%" outerRadius={120} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );

      case "ScatterChart":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="__xKey__" />
            <YAxis dataKey={visibleFields[0]} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter name={config.title || "Dispersão"} data={data} fill={COLORS[0]} />
          </ScatterChart>
        );

      case "RadarChart":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="__xKey__" />
            <PolarRadiusAxis />
            <Radar name={config.title || "Radar"} dataKey={visibleFields[0]} stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        );

      case "ComposedChart":
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="__xKey__" />
            <YAxis width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend onClick={(e: any) => toggleKey(e.dataKey)} />
            {visibleFields.map((f, i) =>
              i === 0 ? (
                <Bar key={f} dataKey={f} barSize={20} fill={COLORS[i % COLORS.length]} />
              ) : (
                <Line key={f} type="monotone" dataKey={f} stroke={COLORS[i % COLORS.length]} />
              )
            )}
          </ComposedChart>
        );

      default:
        return <p className="text-gray-400">Tipo de gráfico não suportado: {config.chartType}</p>;
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-lg md:w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Informe o que deseja que seja exibido no gráfico..."
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
        >
          Buscar
        </button>
        {data && config && (
          <button
            onClick={downloadChart}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all"
          >
            📥 Baixar gráfico
          </button>
        )}
      </div>

      <div>
        {loading && <p className="text-gray-400">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && config && (
          <div ref={chartRef}>
            <h2 className="text-xl font-bold text-white mb-4">{config.title}</h2>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {!loading && !data && !error && <p className="text-gray-400 text-sm">Nenhum resultado ainda.</p>}
      </div>
    </div>
  );
}
