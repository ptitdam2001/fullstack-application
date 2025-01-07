
// db.js
import Dexie, { type EntityTable } from 'dexie';

const dbname = import.meta.env.VITE_CLIENT_STORAGE ?? 'default_application_database';

// tables types
export type Spotify = {
  id: number;
  token: string;
  expireAt: number;
}

export type Tmdb = {
  id: number;
  token: string;
  expireAt: number;
}

const db = new Dexie(dbname) as Dexie & {
  spotify: EntityTable<Spotify, 'id'>;
  tmdb: EntityTable<Tmdb, 'id'>;
};

db.version(1).stores({
  spotify: 'id, token, expireAt',
  tmdb: 'id, token, expireAt'
});

export { db }
