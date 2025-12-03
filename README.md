📄 Resume Builder
A full-stack web application to create, edit, and preview professional resumes with AI-powered enhancements.

✨ Features
Create and edit resumes with rich sections
(Summary, Experience, Education, Skills, Projects)
AI-generated summaries and experience descriptions
Profile image upload using ImageKit
Public, shareable resume preview links
JWT-based authentication & user dashboard
Responsive and modern UI built with React + Tailwind

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
Multer + ImageKit (image uploads)
JWT Authentication
OpenAI API

🚀 Quick Start

Prerequisites
Node.js 18+
MongoDB (Local or Atlas)
ImageKit account
OpenAI API Key

Clone Repository
git clone https://github.com/Sudharshan1305/resume-builder.git
cd resume-builder

Backend Setup
cd server
npm install
cp .env.example .env   # Fill in your environment variables
npm start

Frontend Setup
cd client
npm install
npm start

📁 Project Structure
resume-builder/
├── server/               # Express API (routes, controllers, models)
├── client/               # React frontend
├── .gitignore
└── README.md

🌐 API Endpoints
Method	Endpoint	Description
POST	/api/resumes/create	Create new resume
PUT	/api/resumes/update	Update resume (with image)
GET	/api/resumes/get/:id	Get user's resume
GET	/api/resumes/public/:id	Public resume preview
🔧 Environment Variables

Create .env inside server/
MONGODB_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_secret
OPENAI_API_KEY=your_openai_key

📱 Local Development URLs
Backend → http://localhost:5000
Frontend → http://localhost:3000
Dashboard → http://localhost:3000/app
