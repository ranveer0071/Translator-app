# 🌍 Translator App  

A **full-stack translation web application** built with **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend.  
This app allows users to translate text between multiple languages, manage translation history, and authenticate securely.  

---

## ✨ Features  

- 🔑 **User Authentication** (Login / Register with JWT)  
- 🌐 **Text Translation** between multiple languages  
- 🗂️ **Translation History** stored in MongoDB  
- 🚀 **Fast Frontend** with React 19 + Vite  
- 🎉 **Modern UI Enhancements** with Flag Icons & Toast Notifications  
- 📡 **RESTful APIs** for history & authentication  

---

## 🛠️ Tech Stack  

### **Frontend**  
- React 19 (Vite)  
- React Router DOM  
- Axios (API calls)  
- React Toastify  
- Flag Icons  

### **Backend**  
- Node.js + Express  
- MongoDB + Mongoose  
- dotenv (env management)  
- CORS  

---

## 📂 Project Structure  

Translator-app/
│── client/ # React frontend (Vite)
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── index.css
│ │ └── components/
│ └── package.json
│
│── server/ # Express backend
│ ├── routes/
│ │ ├── auth.js
│ │ └── history.js
│ ├── server.js
│ ├── package.json
│ └── .env (ignored)
│
└── README.md

---

## ⚙️ Installation & Setup  

### **1️⃣ Clone the repo**  
```bash
git clone https://github.com/ranveer0071/Translator-app.git
cd Translator-app

2️⃣ Frontend Setup (React)
cd client
npm install
npm run dev

3️⃣ Backend Setup (Express + MongoDB)
cd server
npm install
npm start

🔑 Environment Variables

Create a .env file in the server/ folder:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key


📡 API Endpoints
Authentication

POST /auth/register → Register new user

POST /auth/login → Login user & get token

History

GET /api/history → Get user’s translation history

POST /api/history → Save new translation

🚀 Future Improvements

✅ Deploy backend (Render / Railway / Heroku)

✅ Deploy frontend (Vercel / Netlify)

🌟 Add multiple user roles (Admin / User)

🌟 Add favorites & export history

🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss.



📜 License

This project is licensed under the MIT License.

