import { useState, useEffect, useRef } from "react"
import SearchBar from "./components/SearchBar"
import AlbumCard from "./components/AlbumCard"

function Particles() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      ox: 0, oy: 0,
      r: Math.random() * 1.8 + 0.2,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.1,
      bright: Math.random() > 0.88,
    }))
    particles.forEach(p => { p.ox = p.x; p.oy = p.y })

    // Nebulas de fondo
    const nebulas = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, r: 300, color: "rgba(201,168,76,0.025)" },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.7, r: 250, color: "rgba(100,80,180,0.02)" },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, r: 400, color: "rgba(201,168,76,0.015)" },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibuja nebulas
      nebulas.forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        grad.addColorStop(0, n.color)
        grad.addColorStop(1, "transparent")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Líneas entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(201,168,76,${0.07 * (1 - dist / 80)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => {
        const mdx = p.x - mouse.current.x
        const mdy = p.y - mouse.current.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        const repelRadius = 110
        if (mdist < repelRadius && mdist > 0) {
          const force = (repelRadius - mdist) / repelRadius
          p.x += (mdx / mdist) * force * 4
          p.y += (mdy / mdist) * force * 4
        } else {
          p.x += (p.ox - p.x) * 0.025
          p.y += (p.oy - p.y) * 0.025
        }

        p.ox += p.dx
        p.oy += p.dy
        if (p.ox < 0 || p.ox > canvas.width) p.dx *= -1
        if (p.oy < 0 || p.oy > canvas.height) p.dy *= -1

        if (p.bright) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(201,168,76,0.06)`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.bright
          ? `rgba(240,210,120,${p.opacity})`
          : `rgba(201,168,76,${p.opacity})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onMove = (e) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY }
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999 }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles-canvas" />
}

function App() {
  const [query, setQuery] = useState("")
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchArtist = async () => {
    if (!query) return
    setLoading(true)
    setArtist(null)
    const response = await fetch(`http://127.0.0.1:8000/artist/${query}`)
    const data = await response.json()
    setArtist(data)
    setLoading(false)
  }

  return (
    <>
      <Particles />
      <div style={{
        minHeight: "100vh",
        padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {/* Header dramático */}
        <header style={{
          textAlign: "center",
          marginBottom: "clamp(40px, 8vw, 70px)",
          animation: "fadeUp 0.8s ease both",
          position: "relative",
        }}>
          {/* Grano de fondo del título */}
          <div style={{
            position: "absolute",
            inset: "-20px",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            opacity: 0.4,
            pointerEvents: "none",
            animation: "grain 0.8s steps(1) infinite",
          }} />

          <p style={{
            color: "var(--gold)",
            fontSize: "0.65rem",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: "16px",
            opacity: 0.7,
          }}>
            ✦ Spotify Explorer ✦
          </p>

          <h1
            className="header-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #c9a84c 0%, #e8c96a 40%, #a07830 70%, #c9a84c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: "16px",
            }}>
            Vinilo
          </h1>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}>
            <div style={{ height: "1px", width: "40px", background: "var(--gold)", opacity: 0.3 }} />
            <p style={{
              color: "var(--text-dim)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}>
              Music Discovery
            </p>
            <div style={{ height: "1px", width: "40px", background: "var(--gold)", opacity: 0.3 }} />
          </div>
        </header>

        <SearchBar query={query} setQuery={setQuery} onSearch={searchArtist} />

        {loading && (
          <p style={{
            textAlign: "center",
            color: "var(--text-dim)",
            marginTop: "60px",
            fontSize: "0.68rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            animation: "fadeUp 0.4s ease both",
          }}>
            ◌ Buscando...
          </p>
        )}

        {artist && (
          <div style={{ marginTop: "70px" }}>
            <div style={{
              marginBottom: "40px",
              animation: "fadeUp 0.5s ease both",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              borderBottom: "1px solid rgba(201,168,76,0.1)",
              paddingBottom: "20px",
            }}>
              <div>
                <p style={{
                  color: "var(--gold)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                  opacity: 0.7,
                }}>
                  Artista
                </p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                  color: "var(--text)",
                  lineHeight: 1,
                }}>
                  {artist.nombre}
                </h2>
              </div>
              <p style={{
                color: "var(--text-dim)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}>
                {artist.albums.length} álbumes
              </p>
            </div>

            <div
              className="albums-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "20px",
              }}
            >
              {artist.albums.map((album, i) => (
                <AlbumCard key={album.nombre} album={album} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App