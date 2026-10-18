import { type Actor, actorKey, type Movie, movieKey, type Role } from '../lambdas/shared/model';

// Sample data loaded into the table when the App API stack is first deployed.
// Dates are DD-MM-YYYY, as in the specification.

export const movies: Movie[] = [
  {
    movieId: 1234,
    title: 'The Shawshank Redemption',
    releaseDate: '05-03-1995',
    overview:
      'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, ' +
      'while maintaining his innocence and trying to remain hopeful through simple compassion.',
  },
  {
    movieId: 1235,
    title: 'The Dark Knight',
    releaseDate: '18-07-2008',
    overview:
      'Batman raises the stakes in his war on crime, but soon finds himself prey to a reign of chaos ' +
      'unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
  },
  {
    movieId: 1236,
    title: 'Se7en',
    releaseDate: '22-09-1995',
    overview:
      'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on ' +
      'the seven deadly sins.',
  },
];

export const actors: Actor[] = [
  {
    actorId: 4321,
    name: 'Morgan Freeman',
    dateOfBirth: '01-06-1937',
    bio:
      'An American actor, producer, and narrator. In a career spanning six decades, he has received ' +
      'numerous accolades, including an Academy Award and a Golden Globe Award.',
  },
  {
    actorId: 4322,
    name: 'Tim Robbins',
    dateOfBirth: '16-10-1958',
    bio: 'An American actor, screenwriter, director and producer, and winner of an Academy Award for Mystic River.',
  },
  {
    actorId: 4323,
    name: 'Christian Bale',
    dateOfBirth: '30-01-1974',
    bio: 'An English actor known for his intense method acting and physical transformations for his roles.',
  },
  {
    actorId: 4324,
    name: 'Heath Ledger',
    dateOfBirth: '04-04-1979',
    bio: 'An Australian actor and music video director, awarded a posthumous Academy Award for The Dark Knight.',
  },
  {
    actorId: 4325,
    name: 'Brad Pitt',
    dateOfBirth: '18-12-1963',
    bio: 'An American actor and film producer, and the recipient of two Academy Awards.',
  },
];

export const roles: Role[] = [
  {
    movieId: 1234,
    actorId: 4321,
    roleName: 'Ellis Boyd "Red" Redding',
    roleDescription:
      'Serves as the film\'s narrator, deuteragonist, and emotional anchor. As a seasoned inmate serving a ' +
      'life sentence, Red is the "man who can get things," a contraband smuggler who becomes the best friend ' +
      'and protector of Andy Dufresne.',
  },
  {
    movieId: 1234,
    actorId: 4322,
    roleName: 'Andy Dufresne',
    roleDescription:
      'A banker wrongly convicted of murdering his wife and her lover, who spends nearly two decades in ' +
      'Shawshank State Penitentiary.',
  },
  {
    movieId: 1235,
    actorId: 4323,
    roleName: 'Bruce Wayne / Batman',
    roleDescription: 'Gotham\'s vigilante protector, who faces the Joker while questioning the cost of his crusade.',
  },
  {
    movieId: 1235,
    actorId: 4324,
    roleName: 'The Joker',
    roleDescription: 'A nihilistic criminal mastermind who sets out to plunge Gotham into anarchy.',
  },
  {
    movieId: 1235,
    actorId: 4321,
    roleName: 'Lucius Fox',
    roleDescription: 'CEO of Wayne Enterprises, who supplies Batman with his equipment and serves as his moral compass.',
  },
  {
    movieId: 1236,
    actorId: 4325,
    roleName: 'Detective David Mills',
    roleDescription: 'An impulsive young detective newly transferred to the city.',
  },
  {
    movieId: 1236,
    actorId: 4321,
    roleName: 'Detective Lt. William Somerset',
    roleDescription: 'A weary veteran detective in his last week before retirement.',
  },
];

// All seed data as table items, with the single-table PK/SK keys.
export const seedItems = (): Record<string, unknown>[] => [
  ...movies.map((m) => ({ PK: movieKey(m.movieId), SK: movieKey(m.movieId), ...m })),
  ...actors.map((a) => ({ PK: actorKey(a.actorId), SK: actorKey(a.actorId), ...a })),
  ...roles.map((r) => ({ PK: movieKey(r.movieId), SK: actorKey(r.actorId), ...r })),
];
