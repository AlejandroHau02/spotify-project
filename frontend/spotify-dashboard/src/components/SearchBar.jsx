import { useState, useEffect } from "react"

const HINTS = [
    "Mahavishnu Orchestra",
    "Miles Davis",
    "Pink Floyd",
    "Weather Report",
    "John Coltrane",
    "Ravi Shankar",
]

function SearchBar({ query, setQuery, onSearch }) {
    const [placeholder, setPlaceholder] = useState("")
    const [hintIdx, setHintIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = HINTS[hintIdx]
        let timeout

        if (!deleting && charIdx <= current.length) {
            timeout = setTimeout(() => {
                setPlaceholder(current.slice(0, charIdx))
                setCharIdx(c => c + 1)
            }, 80)
        } else if (!deleting && charIdx > current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800)
        } else if (deleting && charIdx > 0) {
            timeout = setTimeout(() => {
                setPlaceholder(current.slice(0, charIdx - 1))
                setCharIdx(c => c - 1)
            }, 40)
        } else if (deleting && charIdx === 0) {
            setDeleting(false)
            setHintIdx(i => (i + 1) % HINTS.length)
        }

        return () => clearTimeout(timeout)
    }, [charIdx, deleting, hintIdx])

    return (
        <div
            className="search-wrap"
            style={{
                display: "flex",
                gap: "12px",
                maxWidth: "560px",
                margin: "0 auto",
                animation: "fadeUp 0.6s ease both",
                animationDelay: "0.2s",
                opacity: 0,
            }}
        >
            <input
                type="text"
                placeholder={query ? "" : placeholder + "|"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "4px",
                    padding: "14px 20px",
                    color: "var(--text)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    outline: "none",
                    transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = "var(--gold)"
                    e.target.style.background = "rgba(201,168,76,0.05)"
                    e.target.style.boxShadow = "0 0 20px rgba(201,168,76,0.08)"
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "var(--glass-border)"
                    e.target.style.background = "rgba(255,255,255,0.04)"
                    e.target.style.boxShadow = "none"
                }}
            />
            <button
                onClick={onSearch}
                style={{
                    background: "var(--gold-dim)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "4px",
                    padding: "14px 28px",
                    color: "var(--gold-bright)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    animation: "pulse 2.5s infinite",
                    whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "rgba(201,168,76,0.22)"
                    e.target.style.borderColor = "var(--gold)"
                    e.target.style.boxShadow = "0 0 24px rgba(201,168,76,0.15)"
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "var(--gold-dim)"
                    e.target.style.borderColor = "var(--glass-border)"
                    e.target.style.boxShadow = "none"
                }}
            >
                Buscar
            </button>
        </div>
    )
}

export default SearchBar