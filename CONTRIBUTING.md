# Contributing to Disney+ Clone

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/cullenk/disney-experience-app.git
   cd disney-experience-app
   ```

2. Install dependencies:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. Start development servers:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Structure

- `frontend/` - React + TypeScript + Tailwind CSS
- `backend/` - Node.js + Express + TypeScript + Prisma
- `.vscode/` - VS Code tasks for easy development

## Features

- ✅ Authentication with JWT tokens
- ✅ Disney+ themed UI
- ✅ Movie browsing interface
- ✅ Demo mode fallback
- ✅ Responsive design
