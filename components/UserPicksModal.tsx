'use client';

import React from 'react';

interface NHLTeam {
  id: number;
  name: string;
  abbreviation: string;
  conference: 'Eastern' | 'Western';
  logo: string;
  wins: number;
}

interface UserPicksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  picks: {
    eastern: { [position: number]: number };
    western: { [position: number]: number };
  };
  teams: NHLTeam[];
}

const UserPicksModal: React.FC<UserPicksModalProps> = ({ 
  isOpen, 
  onClose, 
  userName,
  picks,
  teams
}) => {
  if (!isOpen) return null;

  // Get team by ID
  const getTeamById = (id: number) => teams.find(team => team.id === id);

  // Calculate points for a pick
  const calculatePoints = (teamId: number, position: number) => {
    const team = getTeamById(teamId);
    return team ? team.wins * position : 0;
  };

  // Calculate total points for each conference
  const calculateConferenceTotal = (conferencePicks: { [position: number]: number }) => {
    let total = 0;
    Object.entries(conferencePicks).forEach(([position, teamId]) => {
      total += calculatePoints(teamId, parseInt(position));
    });
    return total;
  };

  const easternTotal = calculateConferenceTotal(picks.eastern);
  const westernTotal = calculateConferenceTotal(picks.western);
  const totalPoints = easternTotal + westernTotal;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{userName}'s Playoff Picks</h2>
              <p className="text-white font-medium mt-1">Total Points: {totalPoints}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eastern Conference */}
            <div className="bg-blue-50 rounded-lg overflow-hidden shadow-sm border border-blue-200">
              <div className="bg-blue-600 p-3 text-white">
                <h3 className="text-xl font-bold">Eastern Conference</h3>
                <p className="text-white font-medium text-sm">Total: {easternTotal} points</p>
              </div>
              <div className="p-3">
                <table className="min-w-full">
                  <thead className="border-b-2 border-blue-300 bg-blue-100">
                    <tr>
                      <th className="text-left py-2 px-3 text-blue-900 font-bold">Pos</th>
                      <th className="text-left py-2 px-3 text-blue-900 font-bold">Team</th>
                      <th className="text-center py-2 px-3 text-blue-900 font-bold">Wins</th>
                      <th className="text-right py-2 px-3 text-blue-900 font-bold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(picks.eastern)
                      .sort((a, b) => parseInt(b[0]) - parseInt(a[0])) // Sort by position value (8 to 1)
                      .map(([position, teamId]) => {
                        const team = getTeamById(teamId);
                        const points = calculatePoints(teamId, parseInt(position));
                        return (
                          <tr key={`eastern-${position}`} className="border-b border-blue-100 hover:bg-blue-50">
                            <td className="py-3 px-3 font-bold text-blue-900">{position}</td>
                            <td className="py-3 px-3 text-gray-900">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-7 w-7 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 mr-2">
                                  {team?.abbreviation || '??'}
                                </div>
                                <span className="font-medium">{team?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center text-gray-900 font-medium">{team?.wins || 0}</td>
                            <td className="py-3 px-3 font-bold text-right text-blue-800 text-lg">{points}</td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Western Conference */}
            <div className="bg-red-50 rounded-lg overflow-hidden shadow-sm border border-red-200">
              <div className="bg-red-600 p-3 text-white">
                <h3 className="text-xl font-bold">Western Conference</h3>
                <p className="text-white font-medium text-sm">Total: {westernTotal} points</p>
              </div>
              <div className="p-3">
                <table className="min-w-full">
                  <thead className="border-b-2 border-red-300 bg-red-100">
                    <tr>
                      <th className="text-left py-2 px-3 text-red-900 font-bold">Pos</th>
                      <th className="text-left py-2 px-3 text-red-900 font-bold">Team</th>
                      <th className="text-center py-2 px-3 text-red-900 font-bold">Wins</th>
                      <th className="text-right py-2 px-3 text-red-900 font-bold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(picks.western)
                      .sort((a, b) => parseInt(b[0]) - parseInt(a[0])) // Sort by position value (8 to 1)
                      .map(([position, teamId]) => {
                        const team = getTeamById(teamId);
                        const points = calculatePoints(teamId, parseInt(position));
                        return (
                          <tr key={`western-${position}`} className="border-b border-red-100 hover:bg-red-50">
                            <td className="py-3 px-3 font-bold text-red-900">{position}</td>
                            <td className="py-3 px-3 text-gray-900">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-7 w-7 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800 mr-2">
                                  {team?.abbreviation || '??'}
                                </div>
                                <span className="font-medium">{team?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center text-gray-900 font-medium">{team?.wins || 0}</td>
                            <td className="py-3 px-3 font-bold text-right text-red-800 text-lg">{points}</td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPicksModal; 