export interface Grandmaster {
  username: string;
  title: string;
  url: string;
  name?: string;
  country?: string;
  avatar?: string;
  followers?: number;
  status?: string;
  last_online?: number;
  joined?: number;
  location?: string;
  is_streamer?: boolean;
  verified?: boolean;
  league?: string;
}

export interface GrandmasterDetails {
  player_id: number;
  url: string;
  name?: string;
  username: string;
  title?: string;
  followers: number;
  country: string;
  last_online: number;
  joined: number;
  status: string;
  is_streamer: boolean;
  verified: boolean;
  location?: string;
  avatar?: string;
  league?: string;
}

export interface TitledPlayersResponse {
  players: string[];
}

export interface CountryDetails {
  name: string;
  code: string;
}