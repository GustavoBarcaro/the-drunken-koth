import React from 'react';
import styles from './loading.module.scss';
import { Box, Spinner } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <div className={styles.container}>
      <Box
        className={styles.content}
        height={`100%`}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    </div>
  );
};
