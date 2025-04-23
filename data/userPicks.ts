import { getTeamById } from './nhlTeams';

export interface UserPicksData {
  id: number;
  name: string;
  email?: string;
  picks: {
    eastern: { [position: number]: number }; // Position (1-8) to team ID mapping
    western: { [position: number]: number }; // Position (1-8) to team ID mapping
  };
}

// Updated for 2024 playoff teams and seeds
export const userPicksData: UserPicksData[] = [
  {
    id: 1,
    name: 'John Otto',
    email: 'john.bell@example.com',
    picks: {
      eastern: {
        1: 6, // New Jersey - position 1 = 1×2 = 2 points
        2: 5, // Florida - position 2 = 2×2 = 4 points
        3: 7, // Ottawa - position 3 = 3×2 = 6 points
        4: 8, // Montreal - position 4 = 4×2 = 8 points
        5: 2, // Toronto - position 5 = 5×2 = 10 points
        6: 1, // Washington - position 6 = 6×2 = 12 points
        7: 3, // Tampa Bay - position 7 = 7×2 = 14 points
        8: 4, // Carolina - position 8 = 8×2 = 16 points
      },
      western: {
        8: 9,  // Winnipeg
        7: 10, // Vegas
        3: 11, // Dallas
        4: 12, // LA
        5: 13, // Colorado
        6: 14, // Edmonton
        1: 15, // Minnesota
        2: 16, // St Louis
      }
    }
  },
  {
    id: 2,
    name: 'Karen',
    email: 'sarah.johnson@example.com',
    picks: {
      eastern: {
        1: 8, // Montreal
        5: 7, // Ottawa
        3: 6, // New Jersey
        8: 5, // Florida
        2: 4, // Carolina
        6: 3, // Tampa Bay
        7: 2, // Toronto
        4: 1, // Capitals
      },
      western: {
        1: 16, // St Louis
        2: 15, // Minnesota
        3: 14, // Edmonton
        7: 13, // Colorado
        4: 12, // LA
        6: 11, // Dallas
        5: 10, // Vegas
        8: 9,  // Winnipeg
      }
    }
  },
  {
    id: 3,
    name: '',
    email: 'mike.smith@example.com',
    picks: {
      eastern: {
        1: 2, // Toronto
        2: 4, // Carolina
        3: 6, // New Jersey
        4: 8, // Montreal
        5: 1, // Capitals
        6: 3, // Tampa Bay
        7: 5, // Florida
        8: 7, // Ottawa
      },
      western: {
        1: 10, // Vegas
        2: 12, // LA
        3: 14, // Edmonton
        4: 16, // St Louis
        5: 9,  // Winnipeg
        6: 11, // Dallas
        7: 13, // Colorado
        8: 15, // Minnesota
      }
    }
  },
  {
    id: 4,
    name: '',
    email: 'emily.rodriguez@example.com',
    picks: {
      eastern: {
        1: 3, // Tampa Bay
        2: 5, // Florida
        3: 7, // Ottawa
        4: 1, // Capitals
        5: 2, // Toronto
        6: 4, // Carolina
        7: 6, // New Jersey
        8: 8, // Montreal
      },
      western: {
        1: 11, // Dallas
        2: 13, // Colorado
        3: 15, // Minnesota
        4: 9,  // Winnipeg
        5: 10, // Vegas
        6: 12, // LA
        7: 14, // Edmonton
        8: 16, // St Louis
      }
    }
  },
  {
    id: 5,
    name: '',
    email: 'david.wilson@example.com',
    picks: {
      eastern: {
        1: 4, // Carolina
        2: 3, // Tampa Bay
        3: 2, // Toronto
        4: 1, // Capitals
        5: 8, // Montreal
        6: 7, // Ottawa
        7: 6, // New Jersey
        8: 5, // Florida
      },
      western: {
        1: 14, // Edmonton
        2: 13, // Colorado
        3: 12, // LA
        4: 11, // Dallas
        5: 10, // Vegas
        6: 9,  // Winnipeg
        7: 16, // St Louis
        8: 15, // Minnesota
      }
    }
  }
];

// Calculate score for a single user based on current team wins
export const calculateUserScore = (userId: number) => {
  const user = userPicksData.find(u => u.id === userId);
  if (!user) return 0;
  
  let totalScore = 0;
  
  // Calculate Eastern Conference score
  Object.entries(user.picks.eastern).forEach(([position, teamId]) => {
    const team = getTeamById(teamId);
    if (team) {
      totalScore += team.wins * parseInt(position);
    }
  });
  
  // Calculate Western Conference score
  Object.entries(user.picks.western).forEach(([position, teamId]) => {
    const team = getTeamById(teamId);
    if (team) {
      totalScore += team.wins * parseInt(position);
    }
  });
  
  return totalScore;
};

// Get user's best pick (team that provided the most points)
export const getUserBestPick = (userId: number) => {
  const user = userPicksData.find(u => u.id === userId);
  if (!user) return null;
  
  let bestTeamId = 0;
  let bestPosition = 0;
  let bestPoints = 0;
  
  // Check Eastern Conference picks
  Object.entries(user.picks.eastern).forEach(([position, teamId]) => {
    const team = getTeamById(teamId);
    if (team) {
      const points = team.wins * parseInt(position);
      if (points > bestPoints) {
        bestPoints = points;
        bestTeamId = teamId;
        bestPosition = parseInt(position);
      }
    }
  });
  
  // Check Western Conference picks
  Object.entries(user.picks.western).forEach(([position, teamId]) => {
    const team = getTeamById(teamId);
    if (team) {
      const points = team.wins * parseInt(position);
      if (points > bestPoints) {
        bestPoints = points;
        bestTeamId = teamId;
        bestPosition = parseInt(position);
      }
    }
  });
  
  return {
    teamId: bestTeamId,
    position: bestPosition,
    points: bestPoints
  };
};

// Get all users with their current scores
export const getAllUsersWithScores = () => {
  return userPicksData.map(user => ({
    ...user,
    score: calculateUserScore(user.id),
    bestPick: getUserBestPick(user.id)
  })).sort((a, b) => b.score - a.score);
}; 