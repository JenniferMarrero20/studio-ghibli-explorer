import { useEffect, useState } from "react";
import "./style.css";

export default function Ghibli(){
    const [films, setFilms] = useState([]);
    const [current, setCurrent] = useState(null);
    const [error, setError] = useState("");
    const [banList, setBanList] = useState([]); // stores banned release years


     useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFilms(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      } catch (e) {
        setError(e.message || "Failed to load films");
      }
    })();
  }, []);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!current) return <p>Loading…</p>;

  return (
  <div style={{ maxWidth: 720, margin: "24px auto", padding: 16, textAlign: "center" }}>
    <h1>Veni Vici – Studio Ghibli Explorer</h1>

    {error && <p style={{ color: "crimson" }}>{error}</p>}
    {!current && !error && <p>Loading…</p>}

    {current && (
      <>
        <img
          src={current.image || current.movie_banner}
          alt={current.title}
          style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
        />
        <h2>{current.title}</h2>
        <p><strong>Director:</strong> {current.director}</p>
        <p>
  <strong>Release year:</strong>{" "}
  <span
    style={{ color: "royalblue", cursor: "pointer" }}
    onClick={() => {
      if (!banList.includes(current.release_date)) {
        setBanList([...banList, current.release_date]);
      }
    }}
    title="Click to ban this release year"
  >
    {current.release_date}
  </span>
</p>

      </>
    )}
<div style={{ marginTop: 16 }}>
  <h3>Banned Release Years:</h3>
  {banList.length === 0 ? (
    <p style={{ color: "#888" }}>(none)</p>
  ) : (
    banList.map((year) => (
      <button
        key={year}
        style={{
          margin: 4,
          padding: "4px 8px",
          borderRadius: 6,
          border: "1px solid crimson",
          background: "rgba(255,0,0,0.1)",
          cursor: "pointer",
        }}
        onClick={() => setBanList(banList.filter((y) => y !== year))}
        title="Click to remove from ban list"
      >
        {year} ×
      </button>
    ))
  )}
</div>

    <button
      style={{
        marginTop: 16,
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: "#4b7bec",
        color: "white",
        cursor: "pointer"
      }}
      onClick={() => {
        if (films.length > 0) {
          const random = films[Math.floor(Math.random() * films.length)];
          setCurrent(random);
        }if (films.length > 0) {
  let random;
  let attempts = 0;
  do {
    random = films[Math.floor(Math.random() * films.length)];
    attempts++;
  } while (banList.includes(random.release_date) && attempts < 20);

  setCurrent(random);
}

      }}
    >
      Discover another!
    </button>
  </div>
);
}