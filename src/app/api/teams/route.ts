import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { nhlPlayoffTeamsBase } from '../../../../data/nhlTeamsData';

// Get file path for team data, ensuring it works in Vercel environment
const getTeamDataFilePath = () => {
  // In production (Vercel), use the /tmp directory for writable storage
  if (process.env.VERCEL) {
    return path.join('/tmp', 'teamData.json');
  }
  // In development, use the data directory
  return path.join(process.cwd(), 'data', 'teamData.json');
};

// Initialize team data file in Vercel environment if it doesn't exist
const initTeamDataFile = () => {
  const filePath = getTeamDataFilePath();
  
  // Check if file doesn't exist in Vercel environment
  if (process.env.VERCEL && !fs.existsSync(filePath)) {
    // Create initial data from local version
    const localFilePath = path.join(process.cwd(), 'data', 'teamData.json');
    let initialData;
    
    // Try to read from local data, or create default if not available
    try {
      initialData = JSON.parse(fs.readFileSync(localFilePath, 'utf8'));
    } catch (error) {
      // Default data if local file isn't available
      initialData = {
        teams: nhlPlayoffTeamsBase.map(team => ({
          id: team.id,
          wins: team.wins
        }))
      };
    }
    
    // Write the initial data to the Vercel-compatible location
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
  }
};

// Server-side API route - can use fs here
export async function GET() {
  try {
    // Ensure team data file exists in Vercel environment
    initTeamDataFile();
    
    // Read team data from JSON file
    const filePath = getTeamDataFilePath();
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const teamWinsData = data.teams;
    
    // Merge base team data with wins from JSON file
    const teams = nhlPlayoffTeamsBase.map(team => {
      const savedTeamData = teamWinsData.find((t: { id: number }) => t.id === team.id);
      return {
        ...team,
        wins: savedTeamData ? savedTeamData.wins : team.wins
      };
    });
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
} 