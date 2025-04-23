import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { nhlPlayoffTeamsBase } from '../../../../data/nhlTeamsData';
import { revalidatePath } from 'next/cache';

// Helper function to get team by ID
const getTeamById = (teams: any[], id: number) => {
  return teams.find(team => team.id === id);
};

// Helper function to update team wins in JSON file
const updateTeamWinsInFile = (id: number, wins: number) => {
  try {
    // Read current data
    const filePath = path.join(process.cwd(), 'data', 'teamData.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Update the specific team
    const teamIndex = data.teams.findIndex((t: { id: number }) => t.id === id);
    if (teamIndex >= 0) {
      data.teams[teamIndex].wins = wins;
    } else {
      // Add new team if not found
      data.teams.push({ id, wins });
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    // Get the full team details
    const team = getTeamById(nhlPlayoffTeamsBase, id);
    return { ...team, wins };
  } catch (error) {
    console.error('Failed to update team data:', error);
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
    
    // Load team data from file
    const filePath = path.join(process.cwd(), 'data', 'teamData.json');
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
    
    // Check if team exists
    const team = getTeamById(teams, teamId);
    if (!team) {
      return NextResponse.json(
        { error: `Team with ID ${teamId} not found` },
        { status: 404 }
      );
    }
    
    // Update team wins in file
    const updatedTeam = updateTeamWinsInFile(teamId, wins);
    
    // Revalidate relevant paths to update data across the site
    revalidatePath('/admin');
    revalidatePath('/admin/standings');
    revalidatePath('/');
    
    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error('Error updating team wins:', error);
    return NextResponse.json(
      { error: 'Failed to update team wins' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Use PUT method to update team wins' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 