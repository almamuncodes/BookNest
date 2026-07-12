<div align="center">

# 📖 BookNest

**A free home for readers and storytellers.**
Share a book, discover a new one, and keep reading.

**Live Demo:** [book-nest-lime.vercel.app](https://book-nest-lime.vercel.app)
**Stack:** Next.js · TypeScript · MongoDB · Tailwind CSS

</div>

---

## 📌 Overview

**BookNest** is a full-stack reading platform where readers and storytellers meet. Anyone can upload a book, and anyone can read it — completely free, with no paywalls or gatekeeping. Readers can bookmark titles to build their own shelf, track their reading, and explore a growing catalog across every genre.

🔗 **Live Site:** [book-nest-lime.vercel.app](https://book-nest-lime.vercel.app)

---

## ✨ Features

- 📚 **Vast Library** — thousands of titles shared by a real community of readers
- 🔖 **Smart Bookmarks** — save any book instantly and manage your personal shelf
- 🔎 **Explore & Browse** — search, filter, and sort across genres and categories
- ⭐ **Top Rated & Reviews** — ratings from readers who actually finished the book
- 📊 **Reading Statistics** — books finished, pages read, reading streaks, and genre breakdown
- ✍️ **Add Your Own Book** — protected upload flow for logged-in users
- 🗂️ **Manage Your Books** — view and delete the titles you've shared
- 🔐 **Authentication** — secure login/registration with protected routes
- 📱 **Fully Responsive** — smooth experience across mobile, tablet, and desktop
- 🎨 **Polished UI/UX** — animated sections, hover interactions, and a consistent design system

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (native driver)
- TypeScript

**Auth & Deployment**
- Session-based authentication
- [Vercel](https://vercel.com/) (frontend hosting)

---

## 🗺️ Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, featured books, categories, top rated, stats, testimonials, FAQ |
| `/explore` | Browse all books with search, filtering, and sorting |
| `/bookmarks` | Your saved books |
| `/add-book` | Add a new book *(protected)* |
| `/items/manage` | Manage the books you've posted *(protected)* |
| `/about` | About BookNest |
| `/contact` | Get in touch, with a working contact form |
| `/blog` · `/help` | Blog and support pages |
| `/privacy` · `/terms` | Legal pages |
| `/login` · `/register` | Authentication |

---

## 🔌 API Reference

Base URL: `NEXT_PUBLIC_SERVER_URL`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/items` | Get all books |
| `GET` | `/api/items/:id` | Get a single book by ID |
| `POST` | `/api/items` | Add a new book |
| `PATCH` | `/api/items/:id` | Update a book *(owner only)* |
| `DELETE` | `/api/items/:id` | Delete a book *(owner only)* |
| `GET` | `/api/items/user/:email` | Get all books posted by a user |
| `GET` | `/api/bookmarks/:userId` | Get a user's bookmarks |
| `POST` | `/api/bookmarks` | Toggle a bookmark on/off |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A MongoDB connection string

### 1. Clone the repositories

```bash
git clone https://github.com/<your-username>/booknest-client.git
git clone https://github.com/<your-username>/booknest-server.git
```

### 2. Install dependencies

```bash
cd booknest-client && npm install
cd ../booknest-server && npm install
```

### 3. Set up environment variables

**Client** — `.env.local`
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

**Server** — `.env`
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run the project

```bash
# Server
cd booknest-server && npm run dev

# Client
cd booknest-client && npm run dev
```

The app will be running at `http://localhost:3000`.

---



## 📬 Contact

- **Email:** almamun2026islam@gmail.com
- **Phone:** +880 1994810914
- **Location:** Mymensingh, Bangladesh

---

<div align="center">

Made with 📖 and ☕ by the BookNest team

</div>