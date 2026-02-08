import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import authApi from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/journal.css";

const moods = ["😊 Happy", "😌 Calm", "😐 Neutral", "😔 Sad", "😡 Angry"];

const Journal = () => {
    const [searchParams] = useSearchParams();
    const selectedDate =
  searchParams.get("date") ||
  new Date().toLocaleDateString("en-CA");

    const today = new Date()
        .toLocaleDateString("en-CA");

    const isToday = selectedDate === today;

    const [content, setContent] = useState("");
    const [mood, setMood] = useState("😐 Neutral");
    const [message, setMessage] = useState("");

    // 🔄 Load existing entry (if any)
    useEffect(() => {
        authApi
            .get("/journal/entry", {
                params: {
                    email: localStorage.getItem("email"),
                    date: selectedDate,
                },
            })
            .then(res => {
                // ✅ Entry exists (today or past)
                setContent(res.data.content);
                setMood(res.data.mood);
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    // ✅ No entry exists (normal case)
                    setContent("");
                    setMood("😐 Neutral");
                } else {
                    // ❌ Session expired or real error
                    setMessage("Please login again");
                }
            });
    }, [selectedDate]);


    const handleSave = async () => {
        setMessage("");

        if (!isToday) return;

        try {
            await authApi.post("/journal", {
                email: localStorage.getItem("email"),
                content,
                mood,
            });
            setMessage("Journal saved securely 🌿");
        } catch {
            setMessage("Failed to save journal");
        }
    };

    return (
        <>
            <Navbar />

            <div className="journal-page">
                <div className="journal-card">
                    <h2 className="journal-title">
                        Journal – {selectedDate}
                    </h2>

                    {!isToday && (
                        <p className="journal-lock">
                            This entry is read-only ✨
                        </p>
                    )}

                    {/* Mood */}
                    <select
                        className="mood-select"
                        value={mood}
                        onChange={e => setMood(e.target.value)}
                        disabled={!isToday}
                    >
                        {moods.map(m => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    {/* Content */}
                    <textarea
                        className="journal-textarea"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write freely. This stays private."
                        rows={12}
                        readOnly={!isToday}
                    />

                    <button
                        className="journal-save-btn"
                        onClick={handleSave}
                        disabled={!isToday}
                    >
                        Save Entry
                    </button>

                    {message && (
                        <p className="journal-message">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Journal;
