'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../../../../components/Layout";
import { nhlPlayoffTeams } from "../../../../data/nhlTeams";
import { NHLTeam } from "../../../../data/nhlTeamsData";
import { getAllUsersWithScores } from "../../../../data/userPicks";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email?: string;
  score: number;
  bestPick: {
    teamId: number;
    position: number;
    points: number;
  } | null;
}

const AdminStandingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<NHLTeam[]>(nhlPlayoffTeams);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch latest team data
  const fetchLatestData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get latest team data
      const response = await fetch('/api/teams?' + new Date().getTime());
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data = await response.json();
      setTeams(data.teams);
      
      // Calculate scores using the latest team data
      const usersWithScores = getAllUsersWithScores();
      setUsers(usersWithScores);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load the latest data.');
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchLatestData();
  }, [fetchLatestData]);

  // Get team by ID with current state data
  const getTeam = (id: number) => {
    return teams.find(team => team.id === id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-black">Loading standings...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">NHL Playoff Pool Standings</h1>
          <div className="flex gap-4">
            <button 
              onClick={fetchLatestData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
            <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Back to Admin
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Current Standings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-100">
                <tr>
                  <th className="text-left p-3 text-blue-900">Rank</th>
                  <th className="text-left p-3 text-blue-900">Name</th>
                  <th className="text-left p-3 text-blue-900">Score</th>
                  <th className="text-left p-3 text-blue-900">Best Pick</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const bestTeam = user.bestPick ? getTeam(user.bestPick.teamId) : null;
                  
                  return (
                    <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3 font-bold">{index + 1}</td>
                      <td className="p-3 text-black">{user.name}</td>
                      <td className="p-3 text-black">{user.score}</td>
                      <td className="p-3">
                        {bestTeam ? (
                          <div className="flex items-center">
                            <span className="font-medium text-black">{bestTeam.name}</span>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              {user.bestPick?.points} pts
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600">No points yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Current Team Win Counts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Eastern Conference</h3>
              <table className="w-full">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="text-left p-2 text-blue-900">Team</th>
                    <th className="text-center p-2 text-blue-900">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {teams
                    .filter(team => team.conference === 'Eastern')
                    .map(team => (
                      <tr key={team.id} className="border-b border-gray-100">
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">
                              {team.abbreviation}
                            </div>
                            <span className="text-black">{team.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-center font-bold text-black">{team.wins}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Western Conference</h3>
              <table className="w-full">
                <thead className="bg-red-100">
                  <tr>
                    <th className="text-left p-2 text-red-900">Team</th>
                    <th className="text-center p-2 text-red-900">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {teams
                    .filter(team => team.conference === 'Western')
                    .map(team => (
                      <tr key={team.id} className="border-b border-gray-100">
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">
                              {team.abbreviation}
                            </div>
                            <span className="text-black">{team.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-center font-bold text-black">{team.wins}</td>
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

export default AdminStandingsPage; 