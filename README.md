# NHL Playoff Pool

A Next.js application for tracking NHL playoff teams and managing a playoff pool.

## Features

- Leaderboard showing user rankings and scores
- Team management interface
- Admin dashboard for updating team win counts
- Real-time score calculations based on user picks and team performance

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Deployment to Vercel

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Deployment Steps

1. Push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/nhl-playoff-pool.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New" > "Project"

4. Import your GitHub repository

5. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. Click "Deploy"

## Development

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nhl-playoff-pool.git
cd nhl-playoff-pool
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Data Persistence

The application stores team data in JSON files:
- In development: `data/teamData.json`
- In Vercel production: Uses `/tmp` directory with automatic initialization

## License

MIT
