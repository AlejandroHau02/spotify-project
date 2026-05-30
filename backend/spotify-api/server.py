from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_token():
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        }
    )
    return response.json()["access_token"]

@app.get("/")
def root():
    return {"mensaje": "Servidor funcionando"}

@app.get("/artist/{artist_name}")
def get_artist(artist_name: str):
    token = get_token()
    
    # Buscar artista
    search_response = requests.get(
        "https://api.spotify.com/v1/search",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "q": artist_name,
            "type": "artist",
            "limit": 1,
            "market": "MX"
        }
    )
    artist = search_response.json()["artists"]["items"][0]
    
    # Traer sus álbumes
    albums_response = requests.get(
        f"https://api.spotify.com/v1/artists/{artist['id']}/albums",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "market": "MX",
            "include_groups": "album",
            "limit": 10
        }
    )
    albums = albums_response.json()["items"]
    
    return {
        "nombre": artist["name"],
        "id": artist["id"],
        "albums": [
            {
                "id": a["id"],
                "nombre": a["name"],
                "año": a["release_date"][:4],
                "tracks": a["total_tracks"],
                "imagen": a["images"][0]["url"] if a["images"] else None
            }
            for a in albums
        ]
    }

@app.get("/album/{album_id}")
def get_album_tracks(album_id: str):
    token = get_token()
    response = requests.get(
        f"https://api.spotify.com/v1/albums/{album_id}/tracks",
        headers={"Authorization": f"Bearer {token}"},
        params={"market": "MX", "limit": 20}
    )
    tracks = response.json().get("items", [])
    return {
        "tracks": [
            {
                "nombre": t["name"],
                "duracion": f"{t['duration_ms'] // 60000}:{str((t['duration_ms'] % 60000) // 1000).zfill(2)}"
            }
            for t in tracks
        ]
    }