import React, { useState } from 'react';
import Image from 'next/image';
import Ink from 'react-ink';
import axios from 'axios';

import styles from './login.module.scss';
import logo from '@/public/images/logo.png';
import { signIn, getSession, providers, getCsrfToken } from 'next-auth/client';
import { IncomingMessage } from 'http';
import { GetServerSideProps } from 'next';

export default function Login() {
  const [email, setEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className={styles.login}>
      <section className={styles.container}>
        <div className={styles.logoContainer}>
          <Image
            className={styles.logo}
            width={200}
            height={100}
            src={logo}
            alt="the drunken king of the hill"
          />
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputContent}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => handleEmailInput(e)}
            />
          </div>
          <div className={styles.inputContent}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => handlePasswordInput(e)}
            />
          </div>
        </div>

        <button
          className={styles.loginBtn}
          onClick={() => {
            signIn(`credentials`, {
              username: email,
              password: password,
            });
          }}
        >
          LOGIN
          <Ink />
        </button>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
