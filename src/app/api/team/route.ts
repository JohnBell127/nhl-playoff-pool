import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { nhlPlayoffTeamsBase } from '../../../../data/nhlTeamsData';
import { revalidatePath } from 'next/cache';

// Helper function to get team by ID
const getTeamById = <T extends { id: number }>(
  teams: T[],
  id: number,
): T | undefined => teams.find(team => team.id === id);


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
          wins: team.wins
        }))
      };
    }
    
    try {
      // Write the initial data to the target location (/tmp on Vercel, data/ locally)
      console.log(`Writing initial data to: ${filePath}`);
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
      console.log(`Successfully initialized data file at: ${filePath}`);
    } catch (writeErr) {
      console.error(`Failed to write initial data file to ${filePath}:`, writeErr);
    }
  }
};

// Helper function to update team wins in JSON file
const updateTeamWinsInFile = (id: number, wins: number) => {
  try {
    initTeamDataFile(); // Ensure file exists before trying to update
    const filePath = getTeamDataFilePath();
    console.log(`PUT /api/team - Updating team ${id} with ${wins} wins in file: ${filePath}`);
    
    // Read current data
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Update the specific team
    const teamIndex = data.teams.findIndex((t: { id: number }) => t.id === id);
    if (teamIndex >= 0) {
      data.teams[teamIndex].wins = wins;
    } else {
      // Optionally add team if not found - depends on desired behavior
      console.warn(`Team ID ${id} not found in data file. Not adding.`);
      // data.teams.push({ id, wins }); // Uncomment to add if needed
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated team ${id} in ${filePath}`);
    
    // Get the full team details to return
    const baseTeam = getTeamById(nhlPlayoffTeamsBase, id);
    return { ...baseTeam, wins }; // Return combined data
  } catch (error) {
    console.error(`Failed to update team data for team ID ${id}:`, error);
    return null;
  }
};

export async function PUT(request: Request) {
  try {
    const { teamId, wins } = await request.json();
    
    if (typeof teamId !== 'number' || typeof wins !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request. teamId and wins must be numbers' },
        { status: 400 }
      );
    }
    
    // Update team wins in file
    const updatedTeam = updateTeamWinsInFile(teamId, wins);

    if (!updatedTeam) {
        return NextResponse.json(
            { error: 'Failed to update team wins in storage.' },
            { status: 500 }
        );
    }
    
    // Revalidate relevant paths to update data across the site
    revalidatePath('/admin');
    revalidatePath('/admin/standings');
    revalidatePath('/');
    revalidatePath('/teams'); // Add revalidation for teams page
    
    console.log(`PUT /api/team - Successfully updated team ${teamId}, revalidating paths.`);
    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error('Error updating team wins (PUT request handler): ', error);
    return NextResponse.json(
      { error: 'Failed to update team wins' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This route doesn't really do anything, mainly here for completeness
  try {
    return NextResponse.json({ message: 'Use PUT method to update team wins.' });
  } catch (err) {
    console.error('GET /api/team failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
