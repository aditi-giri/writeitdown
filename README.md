# 🌿 MindVault – Private Journal & Mood Tracker

MindVault is a privacy-first journaling application designed to help users
write freely, track emotions, and reflect without pressure.

---

## ✨ Features

- 📝 Daily journal entries (one per day)
- 🎭 Mood tracking
- 📅 Calendar-based history
- 📊 Mood analytics (weekly & monthly)
- 🔐 End-to-end encryption of journal content
- ⏳ Auto-lock & re-authentication for past entries

---

## 🧠 Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS (custom pastel theme)

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate

### Database
- PostgreSQL

---

## 🔐 Security & Privacy Design

- Passwords are hashed using BCrypt
- Each user has a unique encryption salt
- Journal content is encrypted using AES
- Encryption keys are derived at runtime and never stored
- Past entries require password re-verification
- Encrypted data is stored in the database
- Decrypted content is never logged

---

## 🧩 Architecture

React Frontend → Spring Boot API → PostgreSQL


---

## 🚀 Deployment

- Frontend: Netlify
- Backend: Render
- Database: Cloud PostgreSQL

---

## 👩‍💻 Author

**Aditi Giri**  
Full Stack Developer (Java & MERN)

