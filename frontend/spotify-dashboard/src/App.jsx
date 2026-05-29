import { useState } from "react"

function App() {
  const [query, setQuery] = useState("")
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchArtist = async () => {
    if (!query) return
    setLoading(true)
    const response = await fetch(`http://127.0.0.1:8000/artist/${query}`)
    const data = await response.json()
    setArtist(data)
    setLoading(false)
  }

  return (
    <div>
      <h1>Spotify Dashboard</h1>

      <input
        type="text"
        placeholder="Busca un artista..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchArtist}>Buscar</button>

      {loading && <p>Cargando...</p>}

      {artist && (
        <div>
          <h2>{artist.nombre}</h2>
          {artist.albums.map((album) => (
            <div key={album.nombre}>
              <img src={album.imagen} width={100} />
              <p>{album.año} — {album.nombre} ({album.tracks} tracks)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App