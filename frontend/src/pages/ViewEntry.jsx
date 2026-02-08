import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/journal-view.css";

const ViewEntry = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const selectedDate = searchParams.get("date");
    const today = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === today;

    const [verified, setVerified] = useState(isToday);
    const [password, setPassword] = useState("");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!verified) return;

        authApi
            .get("api/journal/entry", {
                params: {
                    email: localStorage.getItem("email"),
                    date: selectedDate,
                },
            })
            .then(res => {
                setContent(res.data.content);
                setMood(res.data.mood);
            })
            .catch(() => setError("Unable to load entry"));
    }, [verified, selectedDate]);

    const handleVerify = async () => {
        try {
            await authApi.post("api/auth/verify", {
                email: localStorage.getItem("email"),
                password,
            });
            setVerified(true);
        } catch {
            setError("Incorrect password");
        }
    };

    return (
        <>
            <Navbar />

            <div className="journal-page">
                <div className="journal-card view-card">

                    <div className="view-header">
                        <h2 className="journal-title">{selectedDate}</h2>
                        <span className={`view-badge ${isToday ? "edit" : "locked"}`}>
                            {isToday ? "Editable" : "Read only"}
                        </span>
                    </div>

                    {!verified && (
                        <div className="soft-box">
                            <p className="confirm-text">
                                This entry is private. Please confirm your password.
                            </p>

                            <input
                                className="confirm-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <button
                                className="confirm-btn"
                                onClick={handleVerify}
                            >
                                Unlock Entry
                            </button>

                            {error && (
                                <p className="confirm-error">{error}</p>
                            )}
                        </div>
                    )}

                    {verified && (
                        <>
                            <div className="view-mood">
                                <span>Mood</span>
                                <strong>{mood}</strong>
                            </div>

                            <div
                                className="journal-paper"
                                onCopy={e => e.preventDefault()}
                                onCut={e => e.preventDefault()}
                                onPaste={e => e.preventDefault()}
                                onContextMenu={e => e.preventDefault()}
                                style={{ userSelect: "none" }}
                            >
                                {content}
                            </div>

                            <button
                                className="edit-btn"
                                disabled={!isToday}
                                onClick={() =>
                                    navigate(`/journal/edit?date=${selectedDate}`)
                                }
                            >
                                Edit Entry
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewEntry;
