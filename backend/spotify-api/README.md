# Spotify API Consumer

Proyecto de aprendizaje para consumir la API REST de Spotify usando Python y FastAPI.

## Stack
- Python 3.11
- FastAPI
- Uvicorn
- Requests

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Health check del servidor |
| GET | `/artist/{artist_name}` | Discografía de un artista |

## Instalación

1. Clona el repositorio
2. Crea el entorno virtual
```bash
python -m venv venv
venv\Scripts\activate
```
3. Instala dependencias
```bash
pip install -r requirements.txt
```
4. Crea un archivo `.env` con tus credenciales de Spotify

```
CLIENT_ID=tu_client_id_de_spotify
CLIENT_SECRET=tu_client_secret_de_spotify
```

5. Levanta el servidor
```bash
uvicorn server:app --reload
```

## Notas
Credenciales obtenidas en [Spotify Developer Dashboard](https://developer.spotify.com)