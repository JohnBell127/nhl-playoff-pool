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

// Initialize team data file in Vercel /tmp if it doesn't exist
const initTeamDataFile = () => {
  const filePath = getTeamDataFilePath();
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`Data file not found at ${filePath}. Initializing...`);
    let initialData;
    const localFilePath = path.join(process.cwd(), 'data', 'teamData.json');

    // Try to read from local data file if it exists (mainly for dev)
    if (!process.env.VERCEL && fs.existsSync(localFilePath)) {
        try {
            console.log(`Attempting to initialize from local file: ${localFilePath}`);
            initialData = JSON.parse(fs.readFileSync(localFilePath, 'utf8'));
        } catch (err) {
            console.warn(`Local teamData.json found but unreadable (${localFilePath}). Using defaults.`, err);
        }
    }
    
    // If initialData is still undefined (Vercel env or local file issue), use defaults
    if (!initialData) {
      console.log(`Initializing data using nhlPlayoffTeamsBase defaults.`);
      initialData = {
        teams: nhlPlayoffTeamsBase.map(team => ({
          id: team.id,
          wins: team.wins,
        })),
      };
    }
    
    try {
      // Write the initial data to the target location (/tmp on Vercel, data/ locally)
      console.log(`Writing initial data to: ${filePath}`);
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
      console.log(`Successfully initialized data file at: ${filePath}`);
    } catch (writeErr) {
      console.error(`Failed to write initial data file to ${filePath}:`, writeErr);
      // If writing fails, we might be in a truly read-only environment or /tmp is full
      // We'll proceed, but reads might fail later if the file isn't there
    }
  }
};

// Server-side API route - can use fs here
export async function GET() {
  try {
    // Ensure team data file exists (initialize if needed)
    initTeamDataFile();
    
    const filePath = getTeamDataFilePath();
    console.log(`GET /api/teams - Reading data from: ${filePath}`);
    
    // Read team data from JSON file
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
    // Attempt to return default data if file read fails
    console.warn('Failed to read team data file, attempting to return defaults.');
    try {
      return NextResponse.json({ teams: nhlPlayoffTeamsBase });
    } catch (defaultError) {
      console.error('Failed even to return default team data:', defaultError);
      return NextResponse.json(
        { error: 'Failed to fetch teams or return defaults' },
        { status: 500 }
      );
    }
  }
} 