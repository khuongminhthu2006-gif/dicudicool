import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameLayout from './components/GameLayout';
import Dice from './pages/Dice';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Question from './pages/Question';

const STORAGE_KEY = 'thoatbay-game-state';
const MAX_PLAYERS = 4;

const createPlayer = (id) => ({
  id,
  name: `Người chơi ${id}`,
  character: `Nhân vật ${id}`,
  score: 0,
});

const createDefaultPlayers = () => [
  createPlayer(1),
  createPlayer(2),
];

const normalizePlayer = (player) => ({
  ...player,
  character: player.character?.replace('Character', 'Nhân vật') ?? `Nhân vật ${player.id}`,
  name: player.name?.replace('Player', 'Người chơi') ?? `Người chơi ${player.id}`,
});

const loadGameState = () => {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return {
      activePlayerId: 1,
      isGameActive: false,
      pendingChallenge: null,
      players: createDefaultPlayers(),
    };
  }

  try {
    const parsedState = JSON.parse(savedState);
    const players = parsedState.players?.slice(0, MAX_PLAYERS).map(normalizePlayer) ?? createDefaultPlayers();
    const activePlayerExists = players.some((player) => player.id === parsedState.activePlayerId);

    return {
      ...parsedState,
      activePlayerId: activePlayerExists ? parsedState.activePlayerId : players[0].id,
      isGameActive: parsedState.isGameActive ?? false,
      players,
    };
  } catch {
    return {
      activePlayerId: 1,
      isGameActive: false,
      pendingChallenge: null,
      players: createDefaultPlayers(),
    };
  }
};

function App() {
  const [gameState, setGameState] = useState(loadGameState);
  const { activePlayerId, isGameActive, pendingChallenge, players } = gameState;
  const activePlayer = players.find((player) => player.id === activePlayerId) ?? players[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updatePlayer = (playerId, updates) => {
    setGameState((currentState) => ({
      ...currentState,
      isGameActive: true,
      players: currentState.players.map((player) => (
        player.id === playerId ? { ...player, ...updates } : player
      )),
    }));
  };

  const startNewGame = () => {
    setGameState({
      activePlayerId: 1,
      isGameActive: true,
      pendingChallenge: null,
      players: createDefaultPlayers(),
    });
  };

  const addPlayer = () => {
    setGameState((currentState) => {
      if (currentState.players.length >= MAX_PLAYERS) {
        return currentState;
      }

      const nextId = currentState.players.length + 1;

      return {
        ...currentState,
        isGameActive: true,
        players: [...currentState.players, createPlayer(nextId)],
      };
    });
  };

  const removePlayer = () => {
    setGameState((currentState) => {
      if (currentState.players.length <= 2) {
        return currentState;
      }

      const nextPlayers = currentState.players.slice(0, -1);
      const activePlayerExists = nextPlayers.some((player) => (
        player.id === currentState.activePlayerId
      ));

      return {
        ...currentState,
        activePlayerId: activePlayerExists ? currentState.activePlayerId : nextPlayers[0].id,
        isGameActive: true,
        players: nextPlayers,
      };
    });
  };

  const updateActiveScore = (points) => {
    setGameState((currentState) => ({
      ...currentState,
      players: currentState.players.map((player) => (
        player.id === currentState.activePlayerId
          ? { ...player, score: player.score + points }
          : player
      )),
    }));
  };

  const nextPlayer = () => {
    setGameState((currentState) => {
      const currentIndex = currentState.players.findIndex((player) => (
        player.id === currentState.activePlayerId
      ));
      const nextIndex = (currentIndex + 1) % currentState.players.length;

      return {
        ...currentState,
        pendingChallenge: null,
        activePlayerId: currentState.players[nextIndex].id,
      };
    });
  };

  const setPendingChallenge = (challenge) => {
    setGameState((currentState) => ({
      ...currentState,
      pendingChallenge: challenge,
    }));
  };

  const resolveChallenge = (points) => {
    setGameState((currentState) => {
      const currentIndex = currentState.players.findIndex((player) => (
        player.id === currentState.activePlayerId
      ));
      const nextIndex = (currentIndex + 1) % currentState.players.length;

      return {
        ...currentState,
        activePlayerId: currentState.players[nextIndex].id,
        pendingChallenge: null,
        players: currentState.players.map((player) => (
          player.id === currentState.activePlayerId
            ? { ...player, score: player.score + points }
            : player
        )),
      };
    });
  };

  const endGame = () => {
    setGameState({
      activePlayerId: 1,
      isGameActive: false,
      pendingChallenge: null,
      players: createDefaultPlayers(),
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home hasActiveGame={isGameActive} onStartNewGame={startNewGame} />}
        />
        <Route
          path="/lobby"
          element={(
            <Lobby
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdatePlayer={updatePlayer}
              players={players}
            />
          )}
        />
        <Route
          path="/dice"
          element={(
            <GameLayout
              activePlayerId={activePlayerId}
              onEndGame={endGame}
              players={players}
            >
              <Dice
                activePlayer={activePlayer}
                onChallengeRequired={setPendingChallenge}
                onNextPlayer={nextPlayer}
                onUpdateScore={updateActiveScore}
              />
            </GameLayout>
          )}
        />
        <Route
          path="/question"
          element={(
            <GameLayout
              activePlayerId={activePlayerId}
              onEndGame={endGame}
              players={players}
            >
              <Question
                activePlayer={activePlayer}
                onAddScore={updateActiveScore}
                onNextPlayer={nextPlayer}
                onResolveChallenge={resolveChallenge}
                pendingChallenge={pendingChallenge}
              />
            </GameLayout>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
