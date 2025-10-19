import type { TitledPlayersResponse, GrandmasterDetails, CountryDetails } from '../types/chess';

const BASE_URL = 'https://api.chess.com/pub';

export const fetchGrandmasters = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/titled/GM`);
    if (!response.ok) {
      throw new Error('Failed to fetch grandmasters');
    }
    const data: TitledPlayersResponse = await response.json();
    return data.players;
  } catch (error) {
    console.error('Error fetching grandmasters:', error);
    throw error;
  }
};

export const fetchGrandmasterDetails = async (username: string): Promise<GrandmasterDetails> => {
  try {
    const response = await fetch(`${BASE_URL}/player/${username}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${username}`);
    }
    const data: GrandmasterDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${username}:`, error);
    throw error;
  }
};

export const fetchCountryDetails = async (countryUrl: string): Promise<CountryDetails> => {
  try {
    // Extract country code from URL if it's a full URL
    const countryCode = countryUrl.includes('/country/') 
      ? countryUrl.split('/country/')[1] 
      : countryUrl;
    
    const response = await fetch(`${BASE_URL}/country/${countryCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch country details for ${countryCode}`);
    }
    const data: CountryDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching country details for ${countryUrl}:`, error);
    throw error;
  }
};

export const formatTimeElapsed = (lastOnlineTimestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - lastOnlineTimestamp;
  
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  
  return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};