import React from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

export const Error = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex flexDirection="column" alignItems="center">
        <Heading display="flex" alignItems="center">
          Alguma coisa deu errado <FiX color="red" fontSize="60px" />
        </Heading>
        <Text fontSize="2xl">Por favor, tente novamente mais tarde!</Text>
      </Flex>
    </Box>
  );
};
