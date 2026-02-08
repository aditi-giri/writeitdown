import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

const moodColors = {
  "😊 Happy": "#A7D7C5",
  "😌 Calm": "#FFF1A8",
  "😐 Neutral": "#E6EDF3",
  "😔 Sad": "#C7D2E5",
  "😡 Angry": "#F4B6B6",
};

const reflectionPrompts = [
  "What gave you a little peace today?",
  "What are you carrying quietly?",
  "What did you handle better than before?",
  "What do you need more of right now?",
  "What felt heavy — and why?",
];

const Dashboard = () => {
  const navigate = useNavigate();

  const rawEmail = localStorage.getItem("email");
  const name = rawEmail
    ? rawEmail.split("@")[0].charAt(0).toUpperCase() +
      rawEmail.split("@")[0].slice(1)
    : "there";

  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [todayEntry, setTodayEntry] = useState(null);
  const [weekEntries, setWeekEntries] = useState([]);
  const [weeklyMood, setWeeklyMood] = useState("");
  const [prompt] = useState(
    reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  );

  useEffect(() => {
    // Today
    authApi
      .get("api/journal/entry", {
        params: { email: rawEmail, date: today },
      })
      .then(res => setTodayEntry(res.data))
      .catch(() => setTodayEntry(null));

    // Recent 7
    authApi
      .get("api/journal/recent", {
        params: { email: rawEmail },
      })
      .then(res => {
        setWeekEntries(res.data);

        if (res.data.length) {
          const freq = {};
          res.data.forEach(e => {
            freq[e.mood] = (freq[e.mood] || 0) + 1;
          });
          setWeeklyMood(
            Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
          );
        }
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-page">
        {/* HERO STRIP */}
        <section className="dashboard-hero">
          <div>
            <h2>
              {greeting}, {name} 🌿
            </h2>
            <p>How are you arriving today?</p>
          </div>

          <div className="today-box">
            {todayEntry ? (
              <>
                <span className="status-chip">Written today</span>
                <strong>{todayEntry.mood}</strong>
                <button onClick={() => navigate(`/journal/view?date=${today}`)}>
                  Open entry
                </button>
              </>
            ) : (
              <>
                <span className="status-chip empty">No entry yet</span>
                <button onClick={() => navigate("/journal")}>
                  Write now
                </button>
              </>
            )}
          </div>
        </section>

        {/* TWO COLUMN FLOW */}
        <section className="dashboard-flow">
          {/* LEFT */}
          <div className="flow-left">
            <div className="soft-card">
              <h3>Reflection</h3>
              <p className="prompt">“{prompt}”</p>
            </div>

            {weeklyMood && (
              <div className="soft-card">
                <h3>This week feels mostly</h3>
                <span
                  className="mood-chip"
                  style={{ background: moodColors[weeklyMood] }}
                >
                  {weeklyMood}
                </span>
                <p className="soft-text">
                  Awareness matters more than answers.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flow-right">
            <div className="soft-card">
              <h3>Last 7 days</h3>
              <div className="week-strip">
                {weekEntries.map(e => (
                  <span
                    key={e.date}
                    className="day-dot"
                    style={{ background: moodColors[e.mood] }}
                    title={`${e.date} – ${e.mood}`}
                    onClick={() =>
                      navigate(`/journal/view?date=${e.date}`)
                    }
                  />
                ))}
              </div>
              <Link to="/calendar" className="text-link">
                View calendar →
              </Link>
            </div>
          </div>
        </section>

        {/* FLOATING ACTIONS */}
        <div className="dashboard-actions floating">
          <Link to="/journal">New Entry</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/analytics">Insights</Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
