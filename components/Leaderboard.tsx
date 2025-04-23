'use client';

import React, { useState, useEffect, useCallback } from 'react';
import UserPicksModal from './UserPicksModal';
import { userPicksData } from '../data/userPicks';
import { NHLTeam } from '../data/nhlTeamsData';

interface UserWithScore {
  id: number;
  name: string;
  email?: string;
  picks: {
    eastern: { [position: number]: number };
    western: { [position: number]: number };
  };
  score: number;
  bestPick: {
    teamId: number;
    position: number;
    points: number;
  } | null;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserWithScore[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithScore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<NHLTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch latest data from API
  const fetchTeamData = useCallback(async () => {
    try {
      // Force a cache-busting query parameter to get latest data
      const response = await fetch(`/api/teams?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data = await response.json();
      setTeams(data.teams);
      setLastUpdated(new Date());

      // Calculate scores based on current team wins
      const updatedTeams = data.teams;
      const usersWithScores = userPicksData.map(user => {
        let score = 0;
        let bestTeamId = 0;
        let bestPosition = 0;
        let bestPoints = 0;
        
        // Calculate Eastern Conference score and find best pick
        Object.entries(user.picks.eastern).forEach(([position, teamId]) => {
          const team = updatedTeams.find((t: NHLTeam) => t.id === teamId);
          if (team) {
            const points = team.wins * parseInt(position);
            score += points;
            if (points > bestPoints) {
              bestPoints = points;
              bestTeamId = teamId;
              bestPosition = parseInt(position);
            }
          }
        });
        
        // Calculate Western Conference score and find best pick
        Object.entries(user.picks.western).forEach(([position, teamId]) => {
          const team = updatedTeams.find((t: NHLTeam) => t.id === teamId);
          if (team) {
            const points = team.wins * parseInt(position);
            score += points;
            if (points > bestPoints) {
              bestPoints = points;
              bestTeamId = teamId;
              bestPosition = parseInt(position);
            }
          }
        });
        
        return {
          ...user,
          score,
          bestPick: bestPoints > 0 ? {
            teamId: bestTeamId,
            position: bestPosition,
            points: bestPoints
          } : null
        };
      }).sort((a, b) => b.score - a.score);
      
      setUsers(usersWithScores);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load the latest data. Please try again later.');
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    fetchTeamData();
    
    // Optional: Refresh data periodically (every 5 minutes)
    const refreshInterval = setInterval(fetchTeamData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchTeamData]);

  // Custom getTeam function that uses our component state
  const getTeam = (id: number) => {
    return teams.find(team => team.id === id);
  };

  const openUserDetails = (user: UserWithScore) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 text-center">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">NHL Playoff Pool</h1>
        <div className="mt-12 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-gray-700">Loading standings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">NHL Playoff Pool</h1>
        <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchTeamData}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-8 px-3 sm:px-0">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-blue-900">NHL Playoff Pool</h1>
      <p className="text-center text-gray-600 mb-4 sm:mb-6">
        Current Standings
        {lastUpdated && (
          <span className="block text-xs text-gray-500 mt-1">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </p>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 sm:py-4 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Leaderboard</h2>
          <button
            onClick={fetchTeamData}
            className="bg-white text-blue-800 hover:bg-gray-100 py-1 px-2 sm:px-3 rounded text-xs font-medium transition-colors flex items-center"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium border-b border-gray-200">
              <tr>
                <th scope="col" className="px-2 sm:px-6 py-3 sm:py-4 w-12 sm:w-16 text-center">
                  #
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 sm:py-4">
                  Player
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                  Pts
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-4">
                  Best Pick
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const bestTeam = user.bestPick ? getTeam(user.bestPick.teamId) : null;
                
                // Set row highlighting for top 3
                let rowClass = "border-b hover:bg-blue-50 transition-colors";
                if (index === 0) rowClass += " bg-yellow-50"; // Gold
                else if (index === 1) rowClass += " bg-gray-50"; // Silver
                else if (index === 2) rowClass += " bg-amber-50"; // Bronze
                
                return (
                  <tr key={user.id} className={rowClass}>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-bold text-center">
                      {index + 1}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-medium">
                      {user.name}
                      {/* Mobile-only best pick info */}
                      {user.bestPick && user.bestPick.points > 0 && (
                        <span className="block sm:hidden text-xs text-gray-500 mt-1">
                          Best: {bestTeam?.abbreviation || '??'} ({user.bestPick.points}pts)
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-bold text-lg sm:text-xl text-center text-blue-900">
                      {user.score}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      {user.bestPick && user.bestPick.points > 0 ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                            {bestTeam?.abbreviation || '??'}
                          </div>
                          <div className="ml-3">
                            <span className="block">{bestTeam?.name || 'N/A'}</span>
                            <span className="text-xs text-gray-500">({user.bestPick.points} pts)</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No points yet</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 sm:px-3 rounded text-xs font-medium transition-colors"
                        onClick={() => openUserDetails(user)}
                      >
                        <span className="hidden sm:inline">View Picks</span>
                        <span className="sm:hidden">Picks</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-2 sm:mb-3">How Scoring Works</h3>
        <p className="text-gray-600 text-sm">
          Players rank teams from 1-8 in each conference. When a team wins a game, the player gets points equal to the position value they assigned to that team.
        </p>
      </div>

      {selectedUser && (
        <UserPicksModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userName={selectedUser.name}
          picks={selectedUser.picks}
          teams={teams}
        />
      )}
    </div>
  );
};

export default Leaderboard; 