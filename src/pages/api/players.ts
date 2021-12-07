import { Error } from '@/domains/error';
import { Player } from '@/domains/player';
import { fauna } from '@/services/fauna';
import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

interface response {
  data: Array<{
    data: Player;
  }>;
}

const getAllPlayers = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<Player> | Error>,
) => {
  try {
    const players = await fauna.query<response>(
      q.Map(
        q.Paginate(q.Documents(q.Collection(`players`))),
        q.Lambda((x) => {
          return q.Get(x);
        }),
      ),
    );
    if (!players.data.length) {
      return res.status(404).json({
        message: `No players found`,
      });
    }
    res.setHeader(`Content-Type`, `application/json`);
    const formattedPlayer = players.data.map((each) => ({
      ...each.data,
    }));
    return res.status(200).json(formattedPlayer);
  } catch (e: unknown) {
    return res.status(500).json({
      message: `Something went wrong`,
    });
  }
};
export default getAllPlayers;
