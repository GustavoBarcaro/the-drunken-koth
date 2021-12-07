import { fauna } from '@/services/fauna';
import { query as q } from 'faunadb';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils';
import Providers from 'next-auth/providers';

type User = {
  data: data;
};

type data = {
  username: string;
  password: string;
};

const options = {
  providers: [
    Providers.Credentials({
      name: `fauna provider`,
      credentials: {
        username: { label: `email`, type: `text`, placeholder: `john@doe.com` },
        password: { label: `Password`, type: `password` },
      },
      authorize: async (credentials) => {
        try {
          const user = await fauna.query<User>(
            q.Get(
              q.Match(
                q.Index(`user_by_username`),
                q.Casefold(credentials.username),
              ),
            ),
          );
          const doMatch = await bcrypt.compare(
            credentials.password,
            user?.data?.password,
          );
          if (!doMatch) {
            throw {
              requestResult: {
                statusCode: 401,
              },
            };
          }
          return {
            name: user.data.username,
            email: user.data.username,
          };
        } catch (err: any) {
          const serverError =
            err.requestResult?.statusCode === 500
              ? `internalError`
              : `authorization`;
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: `/login`,
    error: `/login`,
  },
};

const Auth = (req: NextApiRequest, res: NextApiResponse<any>) =>
  NextAuth(req, res, options);

export default Auth;
