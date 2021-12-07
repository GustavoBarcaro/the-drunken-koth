import React, { useState } from 'react';
import { Modal } from '@/components/modal';
import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

interface NewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type deck = {
  name: string;
  key: number;
};

export const NewPlayerModal = ({ isOpen, onClose }: NewPlayerModalProps) => {
  const [name, setName] = useState(``);
  const [decks, setDecks] = useState<Array<deck>>([
    {
      name: ``,
      key: 0,
    },
  ]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeDeck = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number,
  ) => {
    const updatedDecks = [...decks];
    updatedDecks[key] = {
      ...updatedDecks[key],
      name: event.target.value,
    };
    setDecks(updatedDecks);
  };
  const handleAddDeck = (newkey: number) => {
    const updatedDeck = [
      ...decks,
      {
        name: ``,
        key: newkey,
      },
    ];
    setDecks(updatedDeck);
  };
  const handleDeleteDeck = (key: number) => {
    const updatedDeck = decks.filter((each) => {
      return each.key !== key;
    });
    setDecks(updatedDeck);
  };

  const handleSavePlayer = async () => {
    const response = axios.post(`/api/savePlayer`, {
      name: name,
      decks: decks,
    });
    console.log(response);
  };

  const shouldShowAddNewDeckBtn = (index: number) => decks.length === index + 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>INFORMAÇÔES DO JOGADOR</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Nome*</FormLabel>
          <Input value={name} onChange={handleChangeName} placeholder="Nome" />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Decks*</FormLabel>
          <Box>
            {decks.map((eachDeck, index) => (
              <InputGroup key={`${eachDeck}+${index}`} marginTop="4px">
                <Input
                  placeholder="Deck name"
                  value={eachDeck.name}
                  onChange={(e) => handleChangeDeck(e, index)}
                />
                {shouldShowAddNewDeckBtn(index) && (
                  <IconButton
                    aria-label="Add one more deck"
                    icon={<FiPlus />}
                    marginLeft={`1rem`}
                    onClick={() => {
                      handleAddDeck(index + 1);
                    }}
                  />
                )}
                {index > 0 && (
                  <IconButton
                    marginLeft={`1rem`}
                    aria-label="remove this deck"
                    icon={<FiTrash2 />}
                    onClick={() => {
                      handleDeleteDeck(eachDeck.key);
                    }}
                  />
                )}
              </InputGroup>
            ))}
          </Box>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="whatsapp"
          mr={3}
          onClick={() => handleSavePlayer()}
        >
          Save
        </Button>
        <Button onClick={onClose} colorScheme="red">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
