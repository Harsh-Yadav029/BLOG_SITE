# 📝 Blog Site — MERN Stack Web Application

A full-stack blogging platform built with the **MERN stack**, enabling users to create, read, update, and delete blog posts with secure authentication and an interactive commenting system. Deployed live on Vercel.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure user registration and login with JSON Web Tokens
- ✍️ **Blog CRUD** — Create, read, update, and delete blog posts
- 💬 **Commenting System** — Users can comment on blog posts in real time
- 🌐 **REST APIs** — Clean and structured API endpoints for all operations
- 📦 **MongoDB Atlas** — Cloud-hosted NoSQL database for scalable data storage
- 🚀 **Deployed on Vercel** — Production-ready deployment with CI/CD via Git

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
BLOG_SITE/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       └── App.js
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware (JWT)
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Yadav029/BLOG_SITE.git
   cd BLOG_SITE
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Run the development server**

   In the `server/` directory:
   ```bash
   npm run dev
   ```

   In the `client/` directory:
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get all blog posts |
| `GET` | `/api/posts/:id` | Get a single post |
| `POST` | `/api/posts` | Create a new post (auth required) |
| `PUT` | `/api/posts/:id` | Update a post (auth required) |
| `DELETE` | `/api/posts/:id` | Delete a post (auth required) |

### Comment Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts/:id/comments` | Get comments for a post |
| `POST` | `/api/posts/:id/comments` | Add a comment (auth required) |
| `DELETE` | `/api/comments/:id` | Delete a comment (auth required) |

---

## 🚢 Deployment

The application is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set the environment variables in Vercel's project settings
4. Deploy — Vercel auto-builds on every push to `main`

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Harsh Kumar Yadav**  
📧 harshyadav2027@gmail.com  

