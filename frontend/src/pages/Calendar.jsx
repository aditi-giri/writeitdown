import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/calendar.css";

const moodColors = {
  "😊 Happy": "#A7D7C5",
  "😌 Calm": "#FFF1A8",
  "😐 Neutral": "#E6EDF3",
  "😔 Sad": "#C7D2E5",
  "😡 Angry": "#F4B6B6",
};

const Calendar = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  useEffect(() => {
    authApi
      .get("/journal/calendar", {
        params: {
          year,
          month,
          email: localStorage.getItem("email"),
        },
      })
      .then(res => setEntries(res.data));
  }, []);

  const daysInMonth = new Date(year, month, 0).getDate();

  const getMoodForDay = day => {
    return entries.find(e => {
      const entryDate = new Date(e.date + "T00:00:00");
      return entryDate.getDate() === day;
    });
  };

  return (
    <>
      <Navbar />

      <div className="calendar-page">
        <div className="calendar-container">
          <h2>Monthly Overview</h2>

          {/* 🎨 LEGEND */}
          <div className="calendar-legend">
            {Object.entries(moodColors).map(([mood, color]) => (
              <div key={mood} className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: color }}
                />
                <span>{mood}</span>
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const entry = getMoodForDay(day);

              return (
                <div
                  key={day}
                  className={`calendar-cell ${entry ? "active" : "inactive"}`}
                  style={{
                    background: entry
                      ? moodColors[entry.mood]
                      : "#f3f8f6",
                  }}
                  onClick={() =>
                    entry &&
                    navigate(`/journal/view?date=${entry.date}`)
                  }
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
