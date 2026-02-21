<h1 align="center">🚀 Secure & Share Govt Document with Family Members</h1>

<p align="center"> 
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Backend-Firebase-orange?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Database-Firestore-yellow?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Auth-Email%20%2B%20OTP-green?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Storage-Firebase%20Storage-purple?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/State-Redux-blueviolet?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Styling-Styled%20Components-black?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Deployment-Firebase%20Hosting-red?style=for-the-badge" /> 
</p> 

<p align="center"> 
  A <b>secure, real-time government document management platform</b> built using <b>React + Firebase</b>. 
  Citizens can <b>digitally store, manage, and securely share</b> important documents such as <b>PAN, Passport, Education, Health & General Files</b> with family members. 
  Designed following <b>modular architecture, secure authentication, and production-level deployment practices</b>. 
</p>

---

## 🌍 Live Application 

🔗 **Live URL:**  [🚀 Secure & Share Govt Document with Family Members](https://govt-docs-2689e.web.app)

---

## 🎯 Problem Statement

Citizens often lose physical copies of important documents such as:
- PAN Card
- Passport
- Educational Certificates
- Health Records
- Government Documents

This platform solves that by:

✅ Digitizing document storage<br>
✅ Linking each account with Aadhaar (masked)<br>
✅ Enabling secure sharing with family members<br>
✅ Reducing physical paperwork<br>
✅ Preventing document loss

---

## 🔐 Core Features

### 👤 Authentication System
- User Registration
- Email Verification
- OTP-based Phone Verification
- Secure Login & Logout
- Route Protection (Public / Private routes)
- Persistent Authentication (Local Storage)

### 📄 Document Management
- Upload documents (Max 5MB)
- Category selection (PAN, Passport, Education, Health, General)
- File type validation
- Real-time document list
- Delete documents (Owner only)
- View documents securely
- Filename sanitization for safety

### 👨‍👩‍👧‍👦 Secure Sharing
- Share documents with family members using UID
- Owner-controlled sharing
- Shared document access (view only)
- Real-time shared document updates

### 👤 Profile Management
- Update profile information
- Upload profile picture
- Masked Aadhaar storage
- Copy UID functionality
- Secure Firestore updates

### 📊 Logging System
- Every important action is logged:
- LOGIN
- LOGOUT
- UPLOAD_DOCUMENT
- DELETE_DOCUMENT
- SHARE_DOCUMENT
- Logs stored in Firestore for audit tracking.

---

## 🛠️ Technologies Used

### Frontend
- **React JS**
- **React Router DOM**
- **Redux Toolkit**
- **Styled Components**
- **React Hot Toast**

### Backend
- **Firebase Authentication**
- **Firestore Database**
- **Firebase Storage**
- **Firebase Hosting**

### Security
- Firestore Security Rules
- Storage Security Rules
- OTP via reCAPTCHA
- Email Verification
- File size & type validation
- Sanitized file names

---

## 🧠 How the Application Works

1️⃣ User Registers<br>
2️⃣ Email Verification Required<br>
3️⃣ OTP Phone Verification<br>
4️⃣ User can access Dashboard<br>
5️⃣ Upload Documents<br>
6️⃣ Documents stored securely in Firebase Storage<br>
7️⃣ Metadata saved in Firestore<br>
8️⃣ Share with family members via UID<br>
9️⃣ Real-time updates via Firestore listeners

---

## 🗂️ Project Structure

```bash
secure-docs/
├── src/
│   ├── app/                 # Redux store
│   ├── components/          # Navbar, ProtectedRoute, Loader
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── profile/
│   ├── styles/
│   ├── utils/
│   ├── firebase.js
│   └── App.js
├── public/
├── firestore.rules
├── storage.rules
├── firebase.json
├── .env.example
└── README.md
```

---

## 🔐 Security Rules

### Firestore

- Users can read/update only their own profile
- Only document owner can delete/update
- Shared users can only read
- Logs are write-only

### Storage

- Users can access only their own files
- 5MB upload limit enforced
- Delete restricted to owner

---

## 🔧 Setup Instructions (Local Development)

### 📦 Prerequisites

- Node.js (v18+ recommended)
- Firebase Project
- Git

### 1️⃣ Clone Repo

```bash
git clone https://github.com/saicharanjanagama/secure-govt-docs-react.git
cd secure-govt-docs-react
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Create .env
Create file in root:

```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Run App

```bash
npm start
```

---

## 🚀 Deployment (Firebase Hosting)

### Build:

```bash
npm run build
```

### Deploy:

```bash
firebase deploy
```

### Hosting URL:

https://govt-docs-2689e.web.app

---

## 🧪 Test Cases

### Authentication

- Register with valid email
- Register duplicate email
- Login without email verification
- OTP wrong code
- OTP correct code
- Logout

### Documents

- Upload valid file
- Upload >5MB file
- Upload blocked extension
- Delete document
- Share with valid UID
- Share with invalid UID

### Security

- Try accessing another user’s document
- Attempt unauthorized Firestore write

---

## ⚡ Optimization Techniques Used

- Lazy Loading with React Suspense
- Resumable File Upload
- Real-time Firestore Listeners
- Optimistic UI Updates
- Modular Code Architecture
- Reusable Components
- Production Environment Config

---

## 🎯 Future Improvements

- Aadhaar API Integration
- Digital Signature Support
- QR Code Document Access
- Role-based Access (Admin)
- Offline Persistence
- Multi-family group sharing

---

## 👨‍💻 Author

It’s me — **Sai Charan Janagama** 😄<br>
🎓 Computer Science Graduate | 🌐 Aspiring Full Stack Developer<br>
📧 [Email Me](saic89738@gmail.com) ↗<br>
🔗 [LinkedIn](https://www.linkedin.com/in/saicharanjanagama/) ↗<br>
💻 [GitHub](https://github.com/SaiCharanJanagama) ↗

---

## 💬 Feedback

If you have any feedback or suggestions, feel free to reach out!  
Your input helps me improve 🚀

