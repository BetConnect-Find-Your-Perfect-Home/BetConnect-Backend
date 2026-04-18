# BetConnect-Backend

***

### Simple Instructions

> **👋 Hi Team!**
> 
> I have set up the base project for **BetConnect**. Please follow these steps to start working on your tasks:
> 
> 1. **Fork** the repository I shared on GitHub.
> 2. **Clone** your fork to your computer.
> 3. Run `npm install` to get the dependencies.
> 4. **Create a branch** for your work: `git checkout -b feature/yourname-task`.
> 5. **Do not code on main!** Always work on your branch.
> 6. When you are done, `git push` to your fork and open a **Pull Request** on the main repo so I can review it.
### Environment variables

Copy `.env.example` to `.env` and set the required keys before running the app. The backend uses the following environment variables:

- `PORT` – server port (default: `5000`)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – JWT signing secret
- `GROQ_API_KEY` – API key for Groq AI services
