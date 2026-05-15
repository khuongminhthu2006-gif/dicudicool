import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getCharacterOption, getFirstAvailableCharacterValue } from './characterImages';
import GameLayout from './components/GameLayout';
import CardEffect from './pages/CardEffect';
import Dice from './pages/Dice';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Practice from './pages/Practice';
import Question from './pages/Question';
import Settings from './pages/Settings';
import Summary from './pages/Summary';

const STORAGE_KEY = 'thoatbay-game-state';
const SETTINGS_KEY = 'thoatbay-settings';
const MAX_PLAYERS = 4;
const DEFAULT_SETTINGS = {
  compactScoreboard: false,
  hideEliminatedPlayers: false,
  largeText: false,
};

const createPlayer = (id, usedCharacterValues = new Set()) => ({
  id,
  name: `Người chơi ${id}`,
  character: getFirstAvailableCharacterValue(usedCharacterValues),
  score: 20,
  shields: 0,
  skipTurns: 0,
  isEliminated: false,
});

const createDefaultPlayers = () => {
  const firstPlayer = createPlayer(1);
  const secondPlayer = createPlayer(2, new Set([firstPlayer.character]));

  return [firstPlayer, secondPlayer];
};

const ensureUniqueCharacters = (players) => {
  const usedCharacterValues = new Set();

  return players.map((player) => {
    const normalizedCharacter = getCharacterOption(player.character, player.id).value;
    const character = usedCharacterValues.has(normalizedCharacter)
      ? getFirstAvailableCharacterValue(usedCharacterValues)
      : normalizedCharacter;

    usedCharacterValues.add(character);

    return {
      ...player,
      character,
      name: player.name?.replace('Player', 'Người chơi') ?? `Người chơi ${player.id}`,
      shields: Number(player.shields ?? 0),
      skipTurns: Number(player.skipTurns ?? 0),
      isEliminated: Boolean(player.isEliminated),
    };
  });
};

const advanceTurn = (players, activePlayerId) => {
  const currentIndex = players.findIndex((player) => player.id === activePlayerId);
  const nextIndex = ((currentIndex >= 0 ? currentIndex : 0) + 1) % players.length;

  return {
    activePlayerId: players[nextIndex]?.id ?? activePlayerId,
    players,
  };
};

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
    const players = ensureUniqueCharacters(
      parsedState.players?.slice(0, MAX_PLAYERS) ?? createDefaultPlayers(),
    );
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

const loadSettings = () => {
  const savedSettings = localStorage.getItem(SETTINGS_KEY);

  if (!savedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

function App() {
  const [gameState, setGameState] = useState(loadGameState);
  const [settings, setSettings] = useState(loadSettings);
  const { activePlayerId, isGameActive, pendingChallenge, players } = gameState;
  const activePlayer = players.find((player) => player.id === activePlayerId) ?? players[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updatePlayer = (playerId, updates) => {
    setGameState((currentState) => {
      const nextPlayers = currentState.players.map((player) => (
        player.id === playerId ? { ...player, ...updates } : player
      ));

      return {
        ...currentState,
        isGameActive: true,
        players: ensureUniqueCharacters(nextPlayers),
      };
    });
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
      const usedCharacterValues = new Set(currentState.players.map((player) => player.character));

      return {
        ...currentState,
        isGameActive: true,
        players: [...currentState.players, createPlayer(nextId, usedCharacterValues)],
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

  const passRestrictedTurn = () => {
    setGameState((currentState) => {
      const updatedPlayers = currentState.players.map((player) => (
        player.id === currentState.activePlayerId && player.skipTurns > 0
          ? { ...player, skipTurns: player.skipTurns - 1 }
          : player
      ));
      const nextTurn = advanceTurn(updatedPlayers, currentState.activePlayerId);

      return {
        ...currentState,
        pendingChallenge: null,
        activePlayerId: nextTurn.activePlayerId,
        players: nextTurn.players,
      };
    });
  };

  const nextPlayer = () => {
    setGameState((currentState) => {
      const nextTurn = advanceTurn(currentState.players, currentState.activePlayerId);

      return {
        ...currentState,
        pendingChallenge: null,
        activePlayerId: nextTurn.activePlayerId,
        players: nextTurn.players,
      };
    });
  };

  const applyCardEffect = (effect) => {
    setGameState((currentState) => {
      const affectedPlayers = currentState.players.map((player) => {
        if (player.id !== currentState.activePlayerId) {
          return player;
        }

        if (effect.useShield && player.shields > 0) {
          return {
            ...player,
            shields: player.shields - 1,
          };
        }

        if (effect.type === 'shield') {
          return {
            ...player,
            shields: player.shields + 1,
          };
        }

        if (effect.type === 'set-zero') {
          return {
            ...player,
            score: 0,
          };
        }

        if (effect.type === 'half') {
          return {
            ...player,
            score: Math.floor(player.score / 2),
          };
        }

        if (effect.type === 'delta') {
          return {
            ...player,
            score: player.score + effect.points,
          };
        }

        if (effect.type === 'skip') {
          return {
            ...player,
            skipTurns: player.skipTurns + effect.turns,
          };
        }

        if (effect.type === 'eliminate') {
          return {
            ...player,
            isEliminated: true,
          };
        }

        return player;
      });
      const nextTurn = advanceTurn(affectedPlayers, currentState.activePlayerId);

      return {
        ...currentState,
        activePlayerId: nextTurn.activePlayerId,
        pendingChallenge: null,
        players: nextTurn.players,
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
      const updatedPlayers = currentState.players.map((player) => (
        player.id === currentState.activePlayerId
          ? { ...player, score: player.score + points }
          : player
      ));
      const nextTurn = advanceTurn(updatedPlayers, currentState.activePlayerId);

      return {
        ...currentState,
        activePlayerId: nextTurn.activePlayerId,
        pendingChallenge: null,
        players: nextTurn.players,
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
      <div
        className={[
          'app-shell',
          settings.largeText ? 'large-text' : '',
          settings.compactScoreboard ? 'compact-scoreboard' : '',
        ].filter(Boolean).join(' ')}
      >
        <Routes>
        <Route
          path="/"
          element={<Home hasActiveGame={isGameActive} onStartNewGame={startNewGame} />}
        />
        <Route
          path="/settings"
          element={(
            <Settings
              onResetGame={endGame}
              onResetSettings={() => setSettings(DEFAULT_SETTINGS)}
              onUpdateSettings={setSettings}
              settings={settings}
            />
          )}
        />
        <Route
          path="/summary"
          element={<Summary />}
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
          path="/practice"
          element={<Practice />}
        />
        <Route
          path="/dice"
          element={(
            <GameLayout
              activePlayerId={activePlayerId}
              onEndGame={endGame}
              players={players}
              settings={settings}
            >
              <Dice
                activePlayer={activePlayer}
                onChallengeRequired={setPendingChallenge}
                onPassRestrictedTurn={passRestrictedTurn}
                onNextPlayer={nextPlayer}
                onUpdateScore={updateActiveScore}
              />
            </GameLayout>
          )}
        />
        <Route
          path="/card-effect"
          element={(
            <GameLayout
              activePlayerId={activePlayerId}
              onEndGame={endGame}
              players={players}
              settings={settings}
            >
              <CardEffect
                activePlayer={activePlayer}
                onApplyCardEffect={applyCardEffect}
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
              settings={settings}
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
      </div>
    </BrowserRouter>
  );
}

export default App;
