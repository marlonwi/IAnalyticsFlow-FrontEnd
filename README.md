# IAnalyticsFlow‑FrontEnd 🖥️

## Visão Geral
Este é o front‑end do projeto **IAnalyticsFlow**, uma aplicação que permite consultas inteligentes, geração de gráficos dinâmicos (usando Recharts) e exportação de resultados.  
O back‑end (API) está disponível no repositório correspondente.  
Este projeto foi desenvolvido como parte de um processo seletivo de estágio, utilizando boas práticas de desenvolvimento full‑stack.

## Funcionalidades
- Buscar dados e insights através da API  
- Renderizar diversos tipos de gráficos (barra, linha, pizza, dispersão, radar, composto)  
- Exportar gráficos como imagem (PNG)  
- Exportar relatórios em formato `.txt`  
- Ocultar/mostrar séries no gráfico com clique na legenda  
- Layout responsivo (adaptável para desktop e mobile)

## Tech Stack
- React (hooks)  
- Recharts para visualização de dados  
- Fetch API para comunicação com o back‑end  
- Tailwind CSS para estilização rápida e responsiva  
- Ambiente de desenvolvimento local com variáveis de ambiente para segurança de chaves

## Pré‑requisitos
- Node.js (v16 ou superior) e npm/yarn  
- Back‑end IAnalyticsFlow‑BackEnd rodando e acessível  
- Ambiente local:
  ```bash
  # clone este repositório
  git clone https://github.com/marlonwi/IAnalyticsFlow‑FrontEnd.git
  cd IAnalyticsFlow‑FrontEnd

  # instale as dependências
  npm install
  # ou
  yarn install
  ```

## Configuração de ambiente
Crie um arquivo `.env` na raiz do front‑end com as variáveis necessárias:
```env
REACT_APP_API_URL=http://localhost:8000  # ou URL do back‑end no deploy
```
> **Importante**: nunca suba seu `.env` ou chaves secretas no repositório.

## Como rodar
```bash
# rodando em modo de desenvolvimento
npm start
# ou
yarn start
```
Abra [http://localhost:5173](http://localhost:5173) no navegador para visualizar o app.

Para build de produção:
```bash
npm run build
# ou
yarn build
```

## Estrutura de Pastas
```
IAnalyticsFlow‑FrontEnd/
│
├── public/                 # arquivos estáticos
├── src/
│   ├── components/         # componentes reutilizáveis (MarkdownCard, GraficoCard, etc)
│   ├── pages/              # telas/rotas da aplicação
│   ├── services/           # chamadas à API
│   ├── styles/             # arquivos de estilo adicionais
│   └── App.tsx             # componente raiz
│
├── .env                    # variáveis de ambiente (não comitar)
├── package.json
└── README.md
```

## Autor
Marlon William – [GitHub](https://github.com/marlonwi)  
Desenvolvido como parte de um processo seletivo de estágio.
