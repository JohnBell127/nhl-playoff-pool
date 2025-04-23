'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../../../components/Layout";
import { NHLTeam } from "../../../data/nhlTeamsData";

const TeamsPage = () => {
  const [easternTeams, setEasternTeams] = useState<NHLTeam[]>([]);
  const [westernTeams, setWesternTeams] = useState<NHLTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch latest data from API
  const fetchTeamData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Force a cache-busting query parameter to get latest data
      const response = await fetch(`/api/teams?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data = await response.json();
      setLastUpdated(new Date());

      // Split teams by conference and sort by seed
      const eastern = data.teams
        .filter((team: NHLTeam) => team.conference === 'Eastern')
        .sort((a: NHLTeam, b: NHLTeam) => a.seed - b.seed);
        
      const western = data.teams
        .filter((team: NHLTeam) => team.conference === 'Western')
        .sort((a: NHLTeam, b: NHLTeam) => a.seed - b.seed);
      
      setEasternTeams(eastern);
      setWesternTeams(western);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load the latest team data. Please try again later.');
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">NHL Playoff Teams</h1>
          <div className="mt-12 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
            <p className="text-black">Loading teams...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">NHL Playoff Teams</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={fetchTeamData}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">NHL Playoff Teams</h1>
          <div className="flex gap-4 items-center">
            {lastUpdated && (
              <span className="text-xs text-gray-600">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchTeamData}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eastern Conference */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Eastern Conference</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Wins</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Div</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Seed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {easternTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                            {team.abbreviation}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">{team.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-800">
                        {team.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                        {team.division}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {team.seed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Western Conference */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-800">Western Conference</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-900 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Wins</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Div</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Seed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {westernTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                            {team.abbreviation}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">{team.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-red-800">
                        {team.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                        {team.division}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {team.seed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamsPage; 