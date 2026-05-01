# server

FastAPI backend that proxies the dashboard's chat to a local Ollama instance.

## Prerequisites

- Python 3.10+ (3.12 or 3.13 recommended; 3.14 also works if all wheels are available)
- [Ollama](https://ollama.com/) running locally on `http://localhost:11434`
- A pulled tool-capable model, e.g. `ollama pull qwen2.5:7b`

## First-time setup (Windows PowerShell)

```powershell
cd server
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

For macOS / Linux:

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

With venv activated:

```bash
uvicorn main:app --reload --port 8765
```

Or from the repo root via npm:

```bash
npm run dev:server   # runs server with the project's local venv
npm run dev:all      # runs frontend + backend together
```

Health check:

```bash
curl http://localhost:8765/api/health
```

> Port `8765` was chosen because the more common `8000` was already in use on the dev machine. Override via `--port` if you want a different one (and update the Vite proxy in `vite.config.ts` to match).

## Environment variables

| Var            | Default                         | Notes                              |
| -------------- | ------------------------------- | ---------------------------------- |
| `OLLAMA_MODEL` | `qwen2.5:7b`                    | Any chat model `ollama list` shows |
| `OLLAMA_HOST`  | `http://localhost:11434`        | Override if Ollama runs elsewhere  |

## Endpoints

- `GET /api/health` — liveness + currently configured model
- `POST /api/chat` — streams Server-Sent Events. Body: `{ messages: [{role, content}], context?: { activeTab, selectedStudent? } }`. Each event has shape `{ type: "chunk" | "done" | "error", ... }`.
