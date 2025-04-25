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
  const localFilePath = path.join(process.cwd(), 'data', 'teamData.json');

  // Check if running in Vercel and file doesn't exist in /tmp
  if (process.env.VERCEL && !fs.existsSync(filePath)) {
    try {
      // Check if local data file exists to copy from
      if (fs.existsSync(localFilePath)) {
        console.log(`Initializing Vercel /tmp data file from: ${localFilePath}`);
        fs.copyFileSync(localFilePath, filePath); // Copy from local data to /tmp
        console.log(`Successfully initialized data file at: ${filePath}`);
      } else {
        // If local file doesn't exist, initialize with defaults
        console.warn(`Local data file (${localFilePath}) not found. Initializing /tmp/teamData.json with defaults.`);
        const initialData = {
          teams: nhlPlayoffTeamsBase.map(team => ({ id: team.id, wins: team.wins }))
        };
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
      }
    } catch (error) {
      console.error(`Failed to initialize data file at ${filePath}:`, error);
    }
  } else if (!process.env.VERCEL && !fs.existsSync(filePath)) {
    // Handle initialization for local dev if needed (e.g., create data dir/file)
    // Ensure directory exists
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      console.log(`Initializing local data file ${filePath} using nhlPlayoffTeamsBase defaults.`);
      const initialData = {
        teams: nhlPlayoffTeamsBase.map(team => ({ id: team.id, wins: team.wins }))
      };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    } catch (error) {
      console.error(`Failed to initialize local data file ${filePath}:`, error);
    }
  }
};

// Server-side API route - can use fs here
export async function GET() {
  try {
    // Ensure team data file exists (initialize if needed)
    initTeamDataFile();
    
    const filePath = getTeamDataFilePath();
    // console.log(`GET /api/teams - Reading data from: ${filePath}`); // Keep commented or remove
    
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
    // Simpler fallback: just return base data
    return NextResponse.json({ teams: nhlPlayoffTeamsBase });
    /* // Removed more complex fallback logic
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
    */
  }
} 