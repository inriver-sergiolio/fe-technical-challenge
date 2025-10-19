import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGrandmasterDetails, fetchCountryDetails, formatTimeElapsed } from '../utils/api';
import type { GrandmasterDetails } from '../types/chess';

const GrandmasterProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [grandmaster, setGrandmaster] = useState<GrandmasterDetails | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00:00');

  useEffect(() => {
    const loadGrandmaster = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const data = await fetchGrandmasterDetails(username);
        setGrandmaster(data);
        
        // Fetch country name if available
        if (data.country) {
          try {
            const countryDetails = await fetchCountryDetails(data.country);
            setCountryName(countryDetails.name);
            console.log('Country Details:', countryDetails);
          } catch (err) {
            // If country fetch fails, use the country code as fallback
            setCountryName(data.country);
          }
        }
      } catch (err) {
        console.error('Error loading grandmaster details:', err);
        setError('Failed to load grandmaster details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGrandmaster();
  }, [username]);

  useEffect(() => {
    if (!grandmaster?.last_online) return;

    const updateTimer = () => {
      setTimeElapsed(formatTimeElapsed(grandmaster.last_online));
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [grandmaster?.last_online]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !grandmaster) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600">{error || 'Grandmaster not found'}</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to List
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to Grandmasters
        </Link>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              {grandmaster.avatar ? (
                <img
                  src={grandmaster.avatar}
                  alt={grandmaster.username}
                  className="w-20 h-20 rounded-full border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center text-3xl">
                  ♛
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{grandmaster.name || grandmaster.username}</h1>
                <p className="text-blue-100">@{grandmaster.username}</p>
                {grandmaster.title && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                    {grandmaster.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Profile Information</h3>
                  <div className="space-y-2">
                    {(grandmaster.country || countryName) && (
                      <p className="text-gray-600">
                        <span className="font-medium">Country:</span> {countryName || grandmaster.country}
                      </p>
                    )}
                    {grandmaster.location && (
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {grandmaster.location}
                      </p>
                    )}
                    <p className="text-gray-600">
                      <span className="font-medium">Followers:</span> {grandmaster.followers.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        grandmaster.status === 'premium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {grandmaster.status}
                      </span>
                    </p>
                    {grandmaster.is_streamer && (
                      <p className="text-gray-600">
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          🎥 Streamer
                        </span>
                      </p>
                    )}
                    {grandmaster.verified && (
                      <p className="text-gray-600">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          ✓ Verified
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Activity</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Joined:</span> {formatDate(grandmaster.joined)}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Time since last online:</span>
                      </p>
                      <p className="text-2xl font-mono font-bold text-blue-600">
                        {timeElapsed}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last seen: {formatDate(grandmaster.last_online)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={grandmaster.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View on Chess.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrandmasterProfile;