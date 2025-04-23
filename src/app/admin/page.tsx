'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../../../components/Layout";
import { getEasternTeams, getWesternTeams} from "../../../data/nhlTeams";
import { NHLTeam } from '../../../data/nhlTeamsData';
import Link from 'next/link';

const AdminPage = () => {
  const [eastern, setEastern] = useState<NHLTeam[]>(getEasternTeams());
  const [western, setWestern] = useState<NHLTeam[]>(getWesternTeams());
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the latest team data
  const fetchLatestTeamData = useCallback(async () => {
    try {
      // Force a cache-busting request to get fresh data
      const response = await fetch('/api/teams?' + new Date().getTime());
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data = await response.json();
      
      // Update state with fresh data
      setEastern(data.teams.filter((team: NHLTeam) => team.conference === 'Eastern'));
      setWestern(data.teams.filter((team: NHLTeam) => team.conference === 'Western'));
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load the latest team data.');
    }
  }, []);

  // Load the latest data on initial render
  useEffect(() => {
    fetchLatestTeamData();
  }, [fetchLatestTeamData]);

  const handleWinChange = (id: number, wins: number, conference: 'Eastern' | 'Western') => {
    if (conference === 'Eastern') {
      setEastern(prev => 
        prev.map(team => 
          team.id === id ? { ...team, wins } : team
        )
      );
    } else {
      setWestern(prev => 
        prev.map(team => 
          team.id === id ? { ...team, wins } : team
        )
      );
    }
  };

  const updateTeamWins = async (teamId: number, wins: number) => {
    try {
      const response = await fetch('/api/team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, wins }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to update team:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Create an array of all update promises
      const updates = [
        ...eastern.map(team => updateTeamWins(team.id, team.wins)),
        ...western.map(team => updateTeamWins(team.id, team.wins))
      ];
      
      // Execute all updates in parallel
      await Promise.all(updates);
      
      // Fetch updated data to ensure UI is in sync with server
      await fetchLatestTeamData();
      
      setMessage('Win counts updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update teams. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          <Link href="/admin/standings" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            View Standings
          </Link>
        </div>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Update Team Win Counts</h2>
          <p className="mb-4 text-black">Adjust the number of wins for each team. These values will be used to calculate user scores.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Eastern Conference */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Eastern Conference</h3>
              
              <table className="w-full">
                <thead className="border-b border-blue-200">
                  <tr>
                    <th className="text-left py-2 text-blue-900">Team</th>
                    <th className="text-center py-2 text-blue-900">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {eastern.map(team => (
                    <tr key={team.id} className="border-b border-blue-100">
                      <td className="py-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">
                            {team.abbreviation}
                          </div>
                          <span className="text-black">{team.name}</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <input 
                          type="number" 
                          min="0" 
                          value={team.wins} 
                          onChange={(e) => handleWinChange(team.id, parseInt(e.target.value) || 0, 'Eastern')}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-black"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Western Conference */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-900 mb-3">Western Conference</h3>
              
              <table className="w-full">
                <thead className="border-b border-red-200">
                  <tr>
                    <th className="text-left py-2 text-red-900">Team</th>
                    <th className="text-center py-2 text-red-900">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {western.map(team => (
                    <tr key={team.id} className="border-b border-red-100">
                      <td className="py-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">
                            {team.abbreviation}
                          </div>
                          <span className="text-black">{team.name}</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <input 
                          type="number" 
                          min="0" 
                          value={team.wins} 
                          onChange={(e) => handleWinChange(team.id, parseInt(e.target.value) || 0, 'Western')}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-black"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={saveChanges}
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded flex items-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage; 