function App() {
  return (
    <div className="app">
      {/* TOP NAVIGATION */}
      <nav className="nav">
        <div className="nav-left">
          <span className="logo">E-Booking</span>
          <span className="school">SK Bebuloh</span>
        </div>

        <div className="nav-right">
          <button className="nav-btn active">Rooms</button>
          <button className="nav-btn">Timetable</button>
          <button className="nav-btn">My Bookings</button>
          <button className="nav-btn ghost">EN</button>
        </div>
      </nav>

      {/* MAIN AREA */}
      <main className="main">
        <section className="search-card glass">
          <h1>Book Special Rooms</h1>
          <p>
            Choose a room, date and time slot to plan your lesson smoothly.
          </p>

          <div className="search-grid">
            <div className="input-box">Select Room</div>
            <div className="input-box">Select Date</div>
            <div className="input-box">Select Time</div>
            <button className="search-btn">Check Availability</button>
          </div>
        </section>

        <section className="room-section">
          <h2>Available Rooms</h2>

          <div className="room-grid">
            <div className="room-card glass">
              <h3>Computer Lab</h3>
              <p>Makmal Komputer</p>
              <button>Book</button>
            </div>

            <div className="room-card glass">
              <h3>Science Lab</h3>
              <p>Makmal Sains</p>
              <button>Book</button>
            </div>

            <div className="room-card glass">
              <h3>Music Room</h3>
              <p>Bilik Muzik</p>
              <button>Book</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
