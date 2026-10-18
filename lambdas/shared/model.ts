// Table keys, item types and mappers. No AWS clients, so the CDK app can import it too.

// Single-table keys:
//   Movie: m#movieID | m#movieID
//   Actor: a#actorID | a#actorID
//   Role:  m#movieID | a#actorID
export const movieKey = (movieId: number) => `m#${movieId}`;
export const actorKey = (actorId: number) => `a#${actorId}`;

export interface Movie {
  movieId: number;
  title: string;
  releaseDate: string;
  overview: string;
}

export interface Actor {
  actorId: number;
  name: string;
  dateOfBirth: string;
  bio: string;
}

export interface Role {
  movieId: number;
  actorId: number;
  roleName: string;
  roleDescription: string;
}

export const isMovieItem = (item: Record<string, unknown>) =>
  typeof item.SK === 'string' && item.SK.startsWith('m#');
export const isRoleItem = (item: Record<string, unknown>) =>
  typeof item.PK === 'string' && item.PK.startsWith('m#') &&
  typeof item.SK === 'string' && item.SK.startsWith('a#');

export const toRole = ({ movieId, actorId, roleName, roleDescription }: Record<string, any>): Role => ({
  movieId,
  actorId,
  roleName,
  roleDescription,
});

export const toActor = ({ actorId, name, dateOfBirth, bio }: Record<string, any>): Actor => ({
  actorId,
  name,
  dateOfBirth,
  bio,
});

// Parses a path or query string ID; undefined if it isn't a positive integer.
export const parseId = (value: string | undefined): number | undefined =>
  value !== undefined && /^[1-9]\d*$/.test(value) ? Number(value) : undefined;
