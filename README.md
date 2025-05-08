# Habitus – MVP

**Habitus** is a minimalist web app that helps people build meaningful habits and stay accountable through shared goals. This MVP focuses on the essentials: creating personal goals, joining others, and tracking daily progress — all with a clean and focused UI.



## 🔥 Why Habitus?

People are often more committed to supporting others than following through for themselves. Habitus leverages this insight by making goal tracking **social, visible, and accountable**, while maintaining a distraction-free experience.



## ✨ Core Features (MVP)

* OAuth login (Google)
* Create personal goals with frequency, due date, and visibility settings
* Join public goals from other users
* Track daily progress (complete or missed)
* Visual progress tracking (simple metrics, streaks)
* View list of users who joined a shared goal



## 🧱 Tech Stack

- **Frontend:** React + Next.js (App Router)
- **Styling:** Tailwind CSS
- **Auth & Database:** Supabase? (PostgreSQL + Auth)
- **Hosting:** Vercel?



## 🗂 Planned Project Structure
```
/app
  /dashboard – User goals and progress overview
  /goal/\[id] – Goal detail and join flow
  /create – Goal creation form
  /profile – User profile and joined goals

/components – Shared UI components
/lib – Supabase client and utility functions
/styles – Tailwind config and global styles
```


## 🚀 Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up a `.env.local` file with your Supabase credentials:

   * NEXT\_PUBLIC\_SUPABASE\_URL
   * NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY
4. Run the development server using `npm run dev`



## 📌 MVP Roadmap

* ✅ Project setup with Next.js + Supabase
* ✅ Auth integration (Google login)
* ✅ Goal creation and visibility control
* ✅ Join public goals
* ✅ Daily progress tracking
* ⏳ Basic goal metrics (e.g., completion %, streak count)
* ⏳ Soft launch to beta users




# 🎓 Acknowledgments
This project was built as part of the Out in Tech Spring 2025 Mentorship Program and fulfills a graduation requirement.

- Mentor: [Alex Laughnan](https://linkedin.com/in/alexlaughnan)
- Mentee: [Priyanka Kishore](https://linkedin.com/in/priyanka-m-kishore)

Immensely grateful to [Out in Tech](https://outintech.com/) for providing me with this opportunity to grow, build, and connect! 🌈✨
