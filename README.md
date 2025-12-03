📄 Resume Builder
A full-stack web application to create, edit, and preview professional resumes with AI-powered enhancements.

✨ Features
Create and edit resumes with multiple sections:
Summary, Experience, Education, Skills, Projects
AI-generated professional summaries & experience descriptions
Profile image upload using ImageKit
Public, shareable resume preview links
JWT-based user authentication
Responsive React + Tailwind interface
Clean dashboard UI to manage multiple resumes

🛠 Tech Stack

Frontend
React
React Router
Tailwind CSS
Lucide React Icons

Backend
Node.js
Express.js
MongoDB + Mongoose
Multer & ImageKit for file uploads
JWT Authentication
OpenAI API for AI enhancements

🚀 Quick Start

Prerequisites
Node.js 18+
MongoDB (Local or Atlas)
ImageKit account
OpenAI API Key

Clone the Repository
git clone https://github.com/Sudharshan1305/resume-builder.git
cd resume-builder

🖥️ Backend Setup
cd server
npm install
cp .env.example .env   # Add your environment variable values
npm start

💻 Frontend Setup
cd client
npm install
npm start

📁 Folder Structure
resume-builder/
├── server/               # Express Backend (Models, Controllers, Routes)
├── client/               # React Frontend (Components, Pages, Hooks)
├── .gitignore
└── README.md



Create .env inside server/:

MONGODB_URI=your_mongo_connection

JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

OPENAI_API_KEY=your_openai_api_key