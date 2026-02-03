function App() {
  return (
    <div className="app">
      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-glass">
          <h1>Sistem E-Booking SK Bebuloh</h1>
          <p className="hero-subtitle">
            A simple and organised way for teachers to book special rooms,
            clearly and without clashes.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content">
        <section className="intro-card">
          <h2>What is this system?</h2>
          <p>
            This platform helps teachers plan their lessons better by allowing
            early booking of special rooms such as the computer lab, science lab,
            music room, and more.
          </p>
          <p className="muted">
            Designed for SK Bebuloh • Mobile-friendly • Bilingual
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
