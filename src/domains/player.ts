export interface Player {
  idStore: string;
  idPlayer: string;
  playername: string;
  totalPoints: string;
  lastPlayedDeck: string;
  mostPlayedDeck: string;
  decks: Array<{
    deckName: string;
    points: number;
  }>;
}
