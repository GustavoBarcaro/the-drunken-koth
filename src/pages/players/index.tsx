import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/navbar';
import { Player } from '@/domains/player';
import { fetcher } from '@/utils/functions';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Heading,
  Button,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  Text,
  Collapse,
} from '@chakra-ui/react';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronDown,
} from 'react-icons/fi';
import { NewPlayerModal } from '@/containers/newPlayerModal';
import styles from './players.module.scss';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

type collapse = {
  value: boolean;
  key: number;
};

function Players() {
  const { data, error } = useSWR(`/api/players`, fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [players, setPlayers] = useState<Array<Player> | []>(data);
  const [collapses, setCollapses] = useState<Array<collapse>>([]);
  const [searchValue, setSearchValue] = useState<string>(``);

  useEffect(() => {
    setPlayers(data as Array<Player>);
    setCollapses(
      data.map((_: unknown, index: number) => ({
        value: false,
        key: index,
      })),
    );
  }, [data]);

  const handleSearchedPlayers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === `Enter`) {
      if (searchValue.length >= 3 || searchValue.length === 0) {
        const searchedPlayers =
          (data as Array<Player>).filter((each) => {
            return each.playername
              .toUpperCase()
              .includes(searchValue.toUpperCase());
          }) || [];
        setPlayers(searchedPlayers);
      } else {
        toast.info(`Mínimo de 3 letras para a pesquisa.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const isOpenCollapse = (index: number): boolean | undefined =>
    collapses.find((each) => each.key === index)?.value;

  const handleExpandCollapse = (index: number) => {
    const updatedCollapses = [...collapses];
    updatedCollapses[index] = {
      ...updatedCollapses[index],
      value: !updatedCollapses[index].value,
    };
    setCollapses(updatedCollapses);
  };

  if (error) return <Error />;
  if (!data || !players) return <Loading />;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Heading as="h2" size="lg">
            JOGADORES
          </Heading>
          <Box display="flex">
            <InputGroup width="100" marginRight="1rem">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Procurar por jogador..."
                onChange={handleSearchValue}
                onKeyUp={handleSearchedPlayers}
              />
            </InputGroup>
            <Button
              aria-label="create new user"
              rightIcon={<FiPlus />}
              border={`2px solid var(--chakra-colors-facebook-100)`}
              onClick={onOpen}
            >
              NOVO JOGADOR
            </Button>
          </Box>
        </div>

        <Table variant="simple" colorScheme="facebook" className={styles.table}>
          <Thead className={styles.tableHead}>
            <Tr>
              <Th>Nome</Th>
              <Th isNumeric>Pontos totais</Th>
              <Th isNumeric>Decks</Th>
              <Th textAlign={`center`}>Editar</Th>
              <Th textAlign={`center`}>Deletar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {players?.map((each, index) => (
              <React.Fragment key={each.idPlayer}>
                <Tr>
                  <Td>{each.playername}</Td>
                  <Td isNumeric>{each.totalPoints}</Td>
                  <Td isNumeric>
                    {each.decks.length}
                    <IconButton
                      aria-label="expand-decks"
                      icon={<FiChevronDown />}
                      onClick={() => handleExpandCollapse(index)}
                    />
                  </Td>
                  <Td textAlign={`center`}>
                    <IconButton aria-label="edit user" icon={<FiEdit />} />
                  </Td>
                  <Td textAlign={`center`}>
                    <IconButton aria-label="delete user" icon={<FiTrash2 />} />
                  </Td>
                </Tr>
                <Collapse
                  in={isOpenCollapse(index)}
                  unmountOnExit
                  style={{
                    width: `100%`,
                  }}
                >
                  <div
                    style={{
                      width: `80%`,
                      height: `100%`,
                      margin: `0 auto`,
                      padding: `8px 0px`,
                    }}
                  >
                    {each.decks.map((each) => (
                      <div
                        key={each.deckName}
                        style={{
                          whiteSpace: `nowrap`,
                          display: `flex`,
                          justifyContent: `space-between`,
                        }}
                      >
                        <span>{each.deckName}</span>
                        <span>{each.points} points</span>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
        {!players?.length && <Text>Nenhum jogador encontrado!</Text>}
      </div>
      {isOpen && <NewPlayerModal isOpen={isOpen} onClose={onClose} />}
    </div>
  );
}
export default function PlayersPage() {
  return (
    <Navbar>
      <Players />
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
