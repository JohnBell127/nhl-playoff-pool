export interface NHLTeam {
  id: number;
  name: string;
  abbreviation: string; 
  conference: 'Eastern' | 'Western';
  division: string;
  logo: string;
  wins: number;
  seed: number;
}

// 2024 NHL Playoff Teams with base data - no file system dependencies
export const nhlPlayoffTeamsBase: NHLTeam[] = [
  // Eastern Conference
  {
    id: 1,
    name: 'Washington Capitals',
    abbreviation: 'WSH',
    conference: 'Eastern',
    division: 'Metropolitan',
    logo: '/teams/capitals.png',
    wins: 2,
    seed: 1
  },
  {
    id: 2,
    name: 'Toronto Maple Leafs',
    abbreviation: 'TOR',
    conference: 'Eastern',
    division: 'Atlantic',
    logo: '/teams/mapleleafs.png',
    wins: 2,
    seed: 2
  },
  {
    id: 3,
    name: 'Tampa Bay Lightning',
    abbreviation: 'TBL',
    conference: 'Eastern',
    division: 'Atlantic',
    logo: '/teams/lightning.png',
    wins: 2,
    seed: 3
  },
  {
    id: 4,
    name: 'Carolina Hurricanes',
    abbreviation: 'CAR',
    conference: 'Eastern',
    division: 'Metropolitan',
    logo: '/teams/hurricanes.png',
    wins: 2,
    seed: 4
  },
  {
    id: 5,
    name: 'Florida Panthers',
    abbreviation: 'FLA',
    conference: 'Eastern',
    division: 'Atlantic',
    logo: '/teams/panthers.png',
    wins: 2,
    seed: 5
  },
  {
    id: 6,
    name: 'New Jersey Devils',
    abbreviation: 'NJD',
    conference: 'Eastern',
    division: 'Metropolitan',
    logo: '/teams/devils.png',
    wins: 2,
    seed: 6
  },
  {
    id: 7,
    name: 'Ottawa Senators',
    abbreviation: 'OTT',
    conference: 'Eastern',
    division: 'Atlantic',
    logo: '/teams/senators.png',
    wins: 2,
    seed: 7
  },
  {
    id: 8,
    name: 'Montreal Canadiens',
    abbreviation: 'MTL',
    conference: 'Eastern',
    division: 'Atlantic',
    logo: '/teams/canadiens.png',
    wins: 2,
    seed: 8
  },

  // Western Conference
  {
    id: 9,
    name: 'Winnipeg Jets',
    abbreviation: 'WPG',
    conference: 'Western',
    division: 'Central',
    logo: '/teams/jets.png',
    wins: 0,
    seed: 1
  },
  {
    id: 10,
    name: 'Vegas Golden Knights',
    abbreviation: 'VGK',
    conference: 'Western',
    division: 'Pacific',
    logo: '/teams/goldenknights.png',
    wins: 0,
    seed: 2
  },
  {
    id: 11,
    name: 'Dallas Stars',
    abbreviation: 'DAL',
    conference: 'Western',
    division: 'Central',
    logo: '/teams/stars.png',
    wins: 0,
    seed: 3
  },
  {
    id: 12,
    name: 'Los Angeles Kings',
    abbreviation: 'LAK',
    conference: 'Western',
    division: 'Pacific',
    logo: '/teams/kings.png',
    wins: 0,
    seed: 4
  },
  {
    id: 13,
    name: 'Colorado Avalanche',
    abbreviation: 'COL',
    conference: 'Western',
    division: 'Central',
    logo: '/teams/avalanche.png',
    wins: 0,
    seed: 5
  },
  {
    id: 14,
    name: 'Edmonton Oilers',
    abbreviation: 'EDM',
    conference: 'Western',
    division: 'Pacific',
    logo: '/teams/oilers.png',
    wins: 0,
    seed: 6
  },
  {
    id: 15,
    name: 'Minnesota Wild',
    abbreviation: 'MIN',
    conference: 'Western',
    division: 'Central',
    logo: '/teams/wild.png',
    wins: 0,
    seed: 7
  },
  {
    id: 16,
    name: 'St. Louis Blues',
    abbreviation: 'STL',
    conference: 'Western',
    division: 'Central',
    logo: '/teams/blues.png',
    wins: 0,
    seed: 8
  }
]; 