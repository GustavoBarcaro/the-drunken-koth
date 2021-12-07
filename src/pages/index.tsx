import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getSession } from 'next-auth/client';
import Navbar from '@/components/navbar';
import styles from '@/styles/Home.module.css';
import { GetServerSideProps } from 'next';

export default function Home() {
  return (
    <Navbar>
      <main className={styles.container}>Main</main>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
