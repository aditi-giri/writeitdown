import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/intro.css";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";


const Intro = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Navbar />

            <div className="intro-page">
                {/* HERO WITH IMAGE */}
                <section className="intro-hero">
                    <div className="hero-overlay">
                        <h1>Your private space to pause, feel, and reflect 🌿</h1>
                        <p>
                            A calm corner of the internet —
                            write freely, track your moods,
                            and come back to yourself.
                        </p>

                        <div className="intro-actions">
                            {!user ? (
                                <>
                                    <Link to="/register" className="primary-btn">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="secondary-btn">
                                        I already have an account
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="primary-btn">
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/journal" className="secondary-btn">
                                        Write Today’s Entry
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                </section>

                {/* INTRO ROW */}
                <section className="intro-row">
                    <div className="intro-column soft">
                        <h2>Why this journal?</h2>
                        <p>
                            Some thoughts are not meant to be shared.
                            Some feelings need space, not answers.
                        </p>
                        <p>
                            This journal helps you slow down,
                            notice emotional patterns,
                            and build a gentle habit of reflection.
                        </p>
                    </div>

                    <div className="intro-column soft">
                        <h2>What you can do here</h2>
                        <ul className="feature-list">
                            <li>
                                <strong>Write daily</strong>
                                <span>One calm entry per day — no clutter.</span>
                            </li>
                            <li>
                                <strong>Track your mood</strong>
                                <span>See how emotions shift over time.</span>
                            </li>
                            <li>
                                <strong>Look back gently</strong>
                                <span>Calendar view without judgment.</span>
                            </li>
                            <li>
                                <strong>Reflect with insights</strong>
                                <span>Visual patterns, not pressure.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="intro-column soft">
                        <h2>Your privacy comes first</h2>
                        <p>
                            Your entries are private by design.
                            Locked when you’re away.
                            Never shown without your permission.
                        </p>
                        <p className="privacy-note">
                            This journal belongs to you — and only you.
                        </p>
                    </div>
                </section>


                {/* CTA */}
                <section className="intro-footer">
                    {!user ? (
                        <>
                            <h3>Ready to begin?</h3>
                            <Link to="/register" className="primary-btn">
                                Create your journal
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3>Welcome back 🌿</h3>
                            <Link to="/dashboard" className="primary-btn">
                                Continue journaling
                            </Link>
                        </>
                    )}
                </section>

            </div>
        </>
    );
};

export default Intro;
