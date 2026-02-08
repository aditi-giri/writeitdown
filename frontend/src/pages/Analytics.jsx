import { useEffect, useState } from "react";
import authApi from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/analytics.css";

const Analytics = () => {
  const moodColors = {
    "😊 Happy": "#A7D7C5",
    "😌 Calm": "#FFF1A8",
    "😐 Neutral": "#E6EDF3",
    "😔 Sad": "#C7D2E5",
    "😡 Angry": "#F4B6B6",
  };

  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState({});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  useEffect(() => {
    authApi
      .get("/analytics/monthly", {
        params: {
          email: localStorage.getItem("email"),
          year,
          month,
        },
      })
      .then(res => {
        setTrend(res.data.trend);
        setDistribution(res.data.distribution);
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="analytics-page">
        <div className="analytics-container">
          <h2>Monthly Mood Insights</h2>

          {/* LINE GRAPH */}
          <div className="chart-card">
            <h3>Mood Trend</h3>
            <div className="line-chart">
              {trend.map(t => (
                <div
                  key={t.date}
                  className="line-point"
                  style={{ height: `${t.score * 20}px` }}
                  title={`${t.date}: ${t.score}`}
                />
              ))}
            </div>
          </div>

          {/* BAR GRAPH */}
          <div className="chart-card">
            <h3>Mood Distribution</h3>
            <div className="bar-chart">
              {Object.entries(distribution).map(([mood, count]) => (
                <div key={mood} className="bar">
                  <span>{mood}</span>
                  <div
                    className="bar-fill"
                    style={{
                      width: `${count * 30}px`,
                      background: moodColors[mood],
                    }}
                  />
                  <span>{count}</span>
                </div>
              ))}
            </div>

          </div>

          {/* INSIGHTS */}
          <div className="insight-card">
            <p>
              You’ve journaled <strong>{trend.length}</strong> days this
              month 🌿
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
