import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JoinRoomModal from './joinRoomModal';
import { useUser } from '../../context/user-context';
import { requestRooms } from '../../api/room/room-list-endpoints';
import { ChakraProvider } from '@chakra-ui/react';

// Mock the necessary modules
vi.mock('../../context/user-context', () => ({
    useUser: vi.fn(),
}));

vi.mock('../../api/room/room-list-endpoints', () => ({
    requestRooms: vi.fn(),
}));

describe('JoinRoomModal', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockRooms = [
        { roomID: 1, roomName: 'Room 1', started: false, currentPlayers: 2, minPlayers: 3, maxPlayers: 4, private: true },
        { roomID: 2, roomName: 'Full Room', started: false, currentPlayers: 4, minPlayers: 2, maxPlayers: 2, private: false  },
        { roomID: 3, roomName: 'Room 3', started: false, currentPlayers: 1, minPlayers: 2, maxPlayers: 4, private: false  },
        { roomID: 2, roomName: 'Started Room', started: true, currentPlayers: 4, minPlayers: 4, maxPlayers: 4, private: false },
    ];

    it('Renderiza el botón de unirse a partida', () => {
        (useUser as vi.Mock).mockReturnValue({ user: mockUser, isUserLoaded: true });
        (requestRooms as vi.Mock).mockResolvedValue(mockRooms);

        render(
            <ChakraProvider>
                <JoinRoomModal />
            </ChakraProvider>
        );
        expect(screen.getByText('Unirse a partida')).toBeDefined();
    });

    it('Abre el modal y muestra las partidas que corresponden', async () => {
        (useUser as vi.Mock).mockReturnValue({ user: mockUser, isUserLoaded: true });
        (requestRooms as vi.Mock).mockResolvedValue(mockRooms);

        render(
            <ChakraProvider>
                <JoinRoomModal />
            </ChakraProvider>
        );

        fireEvent.click(screen.getByText('Unirse a partida'));

        await waitFor(() => {
            expect(screen.getByText('Lista de partidas disponibles')).toBeDefined();
        });

        expect(screen.getByText('Room 1')).toBeDefined();
        expect(screen.getByText('Room 3')).toBeDefined();
        // Salas filtradas
        expect(screen.queryByText('Full Room')).toBeNull();
        expect(screen.queryByText('Started Room')).toBeNull();
    });

    it('Muestra la cantidad correcta de jugadores para cada partida', async () => {
        (useUser as vi.Mock).mockReturnValue({ user: mockUser, isUserLoaded: true });
        (requestRooms as vi.Mock).mockResolvedValue(mockRooms);

        render(
            <ChakraProvider>
                <JoinRoomModal />
            </ChakraProvider>
        );

        fireEvent.click(screen.getByText('Unirse a partida'));

        await waitFor(() => {
            expect(screen.getByText('2/4')).toBeDefined();
            expect(screen.getByText('1/4')).toBeDefined();
        });
    });
});