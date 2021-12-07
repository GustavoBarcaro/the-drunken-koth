import { Error } from '@/domains/error';
import { Player } from '@/domains/player';
import { fauna } from '@/services/fauna';
import { query as q } from 'faunadb';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';

interface response {
  data: Array<{
    data: Player;
  }>;
}

type deck = {
  name: string;
};

const savePlayer = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const playerBody = {
    idStore: ``,
    idPlayer: uuidv4(),
    playername: req.body.name,
    totalPoints: 0,
    decks: req.body.decks.map((each: deck) => ({
      deckId: uuidv4(),
      deckName: each.name,
      points: 0,
    })),
  };
  const player = await fauna.query<response>(
    q.Create(q.Collection(`players`), { data: playerBody }),
  );
  console.log(player);
  // if (!player.data.length) {
  //   return res.status(404).json({
  //     message: `No players found`,
  //   });
  // }
  // res.setHeader(`Content-Type`, `application/json`);
  // const formattedPlayer = player.data.map((each) => ({
  //   ...each.data,
  // }));
  return res.status(200);
};
export default savePlayer;
