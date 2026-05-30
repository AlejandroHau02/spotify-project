import { useState } from "react"

function AlbumCard({ album, index }) {
    const [spinning, setSpinning] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [tracks, setTracks] = useState(null)
    const [loadingTracks, setLoadingTracks] = useState(false)

    const handleClick = async () => {
        if (expanded) { setExpanded(false); return }
        setExpanded(true)
        if (tracks) return
        setLoadingTracks(true)
        const res = await fetch(`http://127.0.0.1:8000/album/${album.id}`)
        const data = await res.json()
        setTracks(data.tracks)
        setLoadingTracks(false)
    }

    return (
        <div
            onClick={handleClick}
            style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${expanded ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                animation: `fadeUp 0.5s ease both`,
                animationDelay: `${index * 0.07}s`,
                opacity: 0,
                transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
                backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
                if (!expanded) {
                    e.currentTarget.style.transform = "translateY(-6px)"
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,168,76,0.1)"
                }
                setSpinning(true)
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
                setSpinning(false)
            }}
        >
            {/* Imagen con efecto vinilo */}
            <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                    src={album.imagen}
                    alt={album.nombre}
                    style={{
                        width: "100%",
                        aspectRatio: "1",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s",
                        filter: "brightness(0.88)",
                        animation: spinning ? "spin 4s linear infinite" : "none",
                        borderRadius: spinning ? "50%" : "0",
                    }}
                />
                <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: "60px",
                    background: "linear-gradient(transparent, rgba(6,6,10,0.85))"
                }} />
                <span style={{
                    position: "absolute",
                    top: "10px", right: "10px",
                    background: "rgba(6,6,10,0.75)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "3px",
                    padding: "3px 8px",
                    fontSize: "0.62rem",
                    color: "var(--gold)",
                    letterSpacing: "0.15em",
                    backdropFilter: "blur(8px)",
                }}>
                    {album.año}
                </span>
            </div>

            {/* Info básica */}
            <div style={{ padding: "14px 16px" }}>
                <p style={{
                    fontSize: "0.76rem",
                    color: "var(--text)",
                    marginBottom: "6px",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}>
                    {album.nombre}
                </p>
                <p style={{
                    fontSize: "0.62rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.1em",
                }}>
                    {album.tracks} tracks · click para ver
                </p>
            </div>

            {/* Panel de tracks */}
            {expanded && (
                <div style={{
                    borderTop: "1px solid rgba(201,168,76,0.1)",
                    padding: "12px 16px",
                    animation: "fadeDown 0.3s ease both",
                    maxHeight: "200px",
                    overflowY: "auto",
                }}>
                    {loadingTracks ? (
                        <p style={{ color: "var(--text-dim)", fontSize: "0.65rem", letterSpacing: "0.2em" }}>
                            Cargando...
                        </p>
                    ) : (
                        tracks?.map((t, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "5px 0",
                                borderBottom: "1px solid rgba(255,255,255,0.04)",
                                gap: "8px",
                            }}>
                                <span style={{
                                    fontSize: "0.65rem",
                                    color: "var(--text-dim)",
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}>
                                    <span style={{ color: "var(--gold)", marginRight: "8px" }}>{i + 1}</span>
                                    {t.nombre}
                                </span>
                                <span style={{ fontSize: "0.6rem", color: "var(--text-dim)", flexShrink: 0 }}>
                                    {t.duracion}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default AlbumCard