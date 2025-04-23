import { nhlPlayoffTeamsBase, NHLTeam } from './nhlTeamsData';

// For client-side, we'll use base data with any loaded wins
// The actual loading from files will happen in the API routes
export const nhlPlayoffTeams: NHLTeam[] = [...nhlPlayoffTeamsBase];

// Helper function to get Eastern Conference teams
export const getEasternTeams = () => {
  return nhlPlayoffTeams.filter(team => team.conference === 'Eastern');
};

// Helper function to get Western Conference teams
export const getWesternTeams = () => {
  return nhlPlayoffTeams.filter(team => team.conference === 'Western');
};

// Helper function to get team by ID
export const getTeamById = (id: number) => {
  return nhlPlayoffTeams.find(team => team.id === id);
};

// Helper function to update team wins (client-side only)
// Actual persistence happens through the API
export const updateTeamWins = (id: number, wins: number) => {
  const team = nhlPlayoffTeams.find(team => team.id === id);
  if (team) {
    team.wins = wins;
  }
  return team;
}; 