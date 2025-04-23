import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { nhlPlayoffTeamsBase } from '../../../../data/nhlTeamsData';

// Server-side API route - can use fs here
export async function GET() {
  try {
    // Read team data from JSON file
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
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
} 