import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, MapPin, Phone, Mail, ExternalLink, Github, Linkedin, Sun, Moon, ArrowLeft, Play } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('portfolio');
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'leadership', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openGamesPage = () => {
    setCurrentPage('games');
    setSelectedGame(null);
  };

  const backToPortfolio = () => {
    setCurrentPage('portfolio');
    setSelectedGame(null);
  };

  const openGamePopup = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const closeGamePopup = () => {
    setSelectedGame(null);
  };

  // Snake Game Component
  const SnakeGame = () => {
    const [snake, setSnake] = useState([[10, 10]]);
    const [food, setFood] = useState([15, 15]);
    const [direction, setDirection] = useState([0, 1]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const gridSize = 20;

    useEffect(() => {
      if (!isPlaying || gameOver) return;

      const moveSnake = () => {
        setSnake(currentSnake => {
          const newSnake = [...currentSnake];
          const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

          // Check wall collision
          if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize) {
            setGameOver(true);
            setIsPlaying(false);
            return currentSnake;
          }

          // Check self collision
          if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
            setGameOver(true);
            setIsPlaying(false);
            return currentSnake;
          }

          newSnake.unshift(head);

          // Check food collision
          if (head[0] === food[0] && head[1] === food[1]) {
            setScore(prev => prev + 10);
            setFood([
              Math.floor(Math.random() * gridSize),
              Math.floor(Math.random() * gridSize)
            ]);
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      };

      const gameInterval = setInterval(moveSnake, 150);
      return () => clearInterval(gameInterval);
    }, [direction, food, isPlaying, gameOver]);

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (!isPlaying) return;
        
        switch (e.key) {
          case 'ArrowUp':
            if (direction[0] !== 1) setDirection([-1, 0]);
            break;
          case 'ArrowDown':
            if (direction[0] !== -1) setDirection([1, 0]);
            break;
          case 'ArrowLeft':
            if (direction[1] !== 1) setDirection([0, -1]);
            break;
          case 'ArrowRight':
            if (direction[1] !== -1) setDirection([0, 1]);
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, isPlaying]);

    const startGame = () => {
      setSnake([[10, 10]]);
      setFood([15, 15]);
      setDirection([0, 1]);
      setGameOver(false);
      setScore(0);
      setIsPlaying(true);
    };

    const pauseGame = () => {
      setIsPlaying(!isPlaying);
    };

    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Score: {score}</span>
            <div className="space-x-2">
              {!isPlaying && !gameOver && (
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start
                </button>
              )}
              {isPlaying && (
                <button
                  onClick={pauseGame}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Pause
                </button>
              )}
              {gameOver && (
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Restart
                </button>
              )}
            </div>
          </div>
          {gameOver && (
            <div className="text-red-600 dark:text-red-400 font-semibold">Game Over!</div>
          )}
        </div>
        
        <div className="inline-block border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
          <div 
            className="grid gap-0"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              width: '400px',
              height: '400px'
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, index) => {
              const row = Math.floor(index / gridSize);
              const col = index % gridSize;
              const isSnake = snake.some(segment => segment[0] === row && segment[1] === col);
              const isFood = food[0] === row && food[1] === col;
              const isHead = snake[0] && snake[0][0] === row && snake[0][1] === col;

              return (
                <div
                  key={index}
                  className={`w-5 h-5 ${
                    isSnake
                      ? isHead
                        ? 'bg-green-600'
                        : 'bg-green-400'
                      : isFood
                      ? 'bg-red-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Use arrow keys to control the snake
        </div>
      </div>
    );
  };

  // Memory Match Game Component
  const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎵'];

    useEffect(() => {
      initializeGame();
    }, []);

    const initializeGame = () => {
      const shuffledCards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, flipped: false }));
      setCards(shuffledCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameWon(false);
    };

    const handleCardClick = (id: number) => {
      if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [first, second] = newFlipped;
        if (cards[first].emoji === cards[second].emoji) {
          setMatched([...matched, first, second]);
          setFlipped([]);
          if (matched.length + 2 === cards.length) {
            setGameWon(true);
          }
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Moves: {moves}</span>
            <button
              onClick={initializeGame}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
          </div>
          {gameWon && (
            <div className="text-green-600 dark:text-green-400 font-semibold">
              Congratulations! You won in {moves} moves!
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`w-16 h-16 flex items-center justify-center text-2xl cursor-pointer rounded-lg transition-all duration-300 ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-white dark:bg-gray-700 transform rotate-0'
                  : 'bg-blue-600 dark:bg-blue-700 transform rotate-180'
              }`}
            >
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.emoji : '?'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tic Tac Toe Game Component
  const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const calculateWinner = (squares: any[]) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };

    const handleClick = (index: number) => {
      if (board[index] || winner) return;

      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);
      setWinner(calculateWinner(newBoard));
    };

    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    };

    const isDraw = board.every(square => square !== null) && !winner;

    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {winner ? `Winner: ${winner}` : isDraw ? "It's a draw!" : `Next: ${isXNext ? 'X' : 'O'}`}
            </span>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="w-20 h-20 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-3xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {square}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Game Popup Component
  const GamePopup = ({ gameId, onClose }: { gameId: string; onClose: () => void }) => {
    const renderGame = () => {
      switch (gameId) {
        case 'snake':
          return <SnakeGame />;
        case 'memory':
          return <MemoryGame />;
        case 'tictactoe':
          return <TicTacToe />;
        default:
          return <div>Game not found</div>;
      }
    };

    const getGameTitle = () => {
      switch (gameId) {
        case 'snake':
          return 'Snake Game';
        case 'memory':
          return 'Memory Match';
        case 'tictactoe':
          return 'Tic Tac Toe';
        default:
          return 'Game';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getGameTitle()}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-6">
            {renderGame()}
          </div>
        </div>
      </div>
    );
  };

  if (currentPage === 'games') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Games Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={backToPortfolio}
                className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Portfolio</span>
              </button>
              
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Interactive Games
              </h1>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Games Content */}
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Interactive Games Collection
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
                A showcase of interactive games built with React and TypeScript. Click on any game to play!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Snake Game */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-6xl group-hover:animate-bounce">🐍</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Snake Game</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Classic snake game with arrow key controls. Eat food to grow and avoid hitting walls or yourself!
                  </p>
                  <button
                    onClick={() => openGamePopup('snake')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Snake</span>
                  </button>
                </div>
              </div>

              {/* Memory Match Game */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-6xl group-hover:animate-pulse">🧠</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Memory Match</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Test your memory by matching pairs of cards. Flip cards to find matching emojis!
                  </p>
                  <button
                    onClick={() => openGamePopup('memory')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Memory</span>
                  </button>
                </div>
              </div>

              {/* Tic Tac Toe */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-6xl group-hover:animate-bounce">⭕</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Tic Tac Toe</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Classic strategy game for two players. Get three in a row to win!
                  </p>
                  <button
                    onClick={() => openGamePopup('tictactoe')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Tic Tac Toe</span>
                  </button>
                </div>
              </div>

              {/* Coming Soon Games */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <span className="text-6xl">🧱</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Tetris</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Classic block-stacking puzzle game. Coming soon!
                  </p>
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-6xl">🏓</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Pong</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Classic arcade paddle game. Coming soon!
                  </p>
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden opacity-75">
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">🎯</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Breakout</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Break bricks with a bouncing ball. Coming soon!
                  </p>
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Popup */}
        {selectedGame && (
          <GamePopup gameId={selectedGame} onClose={closeGamePopup} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection('home')}
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
              >
                VP
              </button>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'education', label: 'Education' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'certifications', label: 'Certifications' },
                  { id: 'leadership', label: 'Leadership' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'education', label: 'Education' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'skills', label: 'Skills' },
                { id: 'certifications', label: 'Certifications' },
                { id: 'leadership', label: 'Leadership' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-900/20 pt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                  Vidhyasri
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Prakasan</span>
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
                  Software Developer | Front-End Specialist | React Enthusiast
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl transition-colors duration-300">
                  Software Developer at Wizzgeeks Technologies. Passionate about front-end, React, and building impactful digital experiences.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  View My Work
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-3 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
                >
                  Get In Touch
                </button>
              </div>
              
              <div className="flex space-x-6">
                <a
                  href="https://linkedin.com/in/vidhyasri-prakasan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 group"
                >
                  <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="https://github.com/poppyvidhya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <Github className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="mailto:vidhyasriprakasan@gmail.com"
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 group"
                >
                  <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl dark:shadow-emerald-500/20">
                  <div className="w-72 h-72 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300">
                    <div className="text-8xl text-gray-400 dark:text-gray-500">👤</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-xl">🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                As a Software Developer at Wizzgeeks Technologies, I am deepening my expertise in front-end technologies, including HTML, CSS, JavaScript, and React. My academic journey began with a Bachelor of Engineering in Computer Science from Anna University, where I rapidly advanced through various roles, honing my technical and leadership skills.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                I am eager to leverage my background in technology and leadership to drive innovation and make impactful contributions to the software development field.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Namakkal, Tamil Nadu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <a href="tel:+919600708314" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
                      +91 9600708314
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 min-w-0">
                    <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <a 
                      href="mailto:vidhyasriprakasan@gmail.com" 
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 truncate"
                      title="vidhyasriprakasan@gmail.com"
                    >
                      vidhyasriprakasan@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Education</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">B.E Computer Science</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Government College of Engineering, Erode</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">2020 - 2024</p>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">CGPA: 8.24</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏫</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">High School</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Bharani Park Matric Higher Secondary School</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">2019 - 2020</p>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">85.2%</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Secondary School</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Bharani Park Matric Higher Secondary School</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">2017 - 2018</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">95.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-emerald-600 to-teal-600"></div>
              <div className="relative bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-400 rounded-lg p-8 ml-12 hover:shadow-xl transition-all duration-300">
                <div className="absolute -left-4 top-8 w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Software Developer</h3>
                      <p className="text-xl text-emerald-600 dark:text-emerald-400 font-medium">Wizzgeeks Technologies</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors duration-300">
                      July 2024 – Present
                    </span>
                  </div>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <li className="flex items-start">
                      <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                      Developing interactive, API-driven web applications using React
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                      Collaborating with cross-functional teams to deliver high-quality software solutions
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                      Implementing responsive design principles and modern web development practices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl group-hover:animate-bounce">🌿</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Digital Naturalist</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  AI-enabled tool for biodiversity researchers to predict species matches. Leverages machine learning algorithms to help researchers identify and classify various species.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm transition-colors duration-300">AI/ML</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm transition-colors duration-300">Python</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm transition-colors duration-300">Data Science</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl group-hover:animate-pulse">🎵</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">MusiQue</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Web-based music site with playlist management, playback controls, and favorites feature. A comprehensive music streaming platform with modern UI/UX design.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm transition-colors duration-300">React</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm transition-colors duration-300">JavaScript</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm transition-colors duration-300">CSS</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl group-hover:animate-bounce">🚂</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Railway Reservation System</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Java & SQL project supporting train booking, admin/user login, and management features. A complete booking system with database management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm transition-colors duration-300">Java</span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm transition-colors duration-300">SQL</span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm transition-colors duration-300">Database</span>
                </div>
              </div>
            </div>

            {/* Interactive Games Project */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl group-hover:animate-bounce">🎮</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Interactive Games</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Collection of interactive games built with React including Snake, Memory Match, and Tic Tac Toe. Showcasing game development skills and user interaction.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm transition-colors duration-300">React</span>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm transition-colors duration-300">TypeScript</span>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm transition-colors duration-300">Game Dev</span>
                </div>
                <button
                  onClick={openGamesPage}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  <Play className="w-4 h-4" />
                  <span>Play Games</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skills & Expertise</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Programming Languages</h3>
              <div className="space-y-4">
                {[
                  { name: 'React', level: 90, color: 'from-blue-500 to-blue-600' },
                  { name: 'JavaScript', level: 85, color: 'from-yellow-500 to-yellow-600' },
                  { name: 'HTML/CSS', level: 90, color: 'from-orange-500 to-orange-600' },
                  { name: 'Python', level: 80, color: 'from-green-500 to-green-600' },
                  { name: 'Java', level: 75, color: 'from-red-500 to-red-600' },
                  { name: 'SQL', level: 85, color: 'from-purple-500 to-purple-600' }
                ].map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">{skill.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Tools & Technologies</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Tableau', icon: '📊' },
                  { name: 'VS Code', icon: '💻' },
                  { name: 'GitHub', icon: '🐙' },
                  { name: 'MongoDB', icon: '🗄️' },
                  { name: 'PowerBI', icon: '📈' },
                  { name: 'Postman', icon: '📮' }
                ].map((tool) => (
                  <div key={tool.name} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">{tool.name}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 mt-8 transition-colors duration-300">Languages</h3>
              <div className="space-y-3">
                {[
                  { name: 'Tamil', level: 'Native' },
                  { name: 'English', level: 'Fluent' },
                  { name: 'Kannada', level: 'Conversational' },
                  { name: 'Hindi', level: 'Conversational' }
                ].map((lang) => (
                  <div key={lang.name} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                    <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">{lang.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Licenses & Certifications</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Full Stack with Python Programming', org: 'HCL GUVI', date: 'Sep 2023', highlight: true },
              { name: 'CCNA: Introduction to Networks', org: 'Cisco', date: 'May 2023', highlight: false },
              { name: 'Geodata Processing using Python', org: 'ISRO', date: 'Mar 2023', highlight: false },
              { name: 'Programming, Data Structures, and Algorithms using Python', org: 'NPTEL', date: 'Oct 2022', highlight: true },
              { name: 'SQL Basic', org: 'HackerRank', date: 'Sep 2022', highlight: false },
              { name: 'Network Analysis & Troubleshooting with Wireshark', org: 'Skill-Lync', date: 'Oct 2021', highlight: false }
            ].map((cert, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 group ${
                  cert.highlight ? 'border-2 border-emerald-600 dark:border-emerald-400' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    cert.highlight ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    {cert.highlight && (
                      <span className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs px-2 py-1 rounded-full mb-1">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{cert.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">{cert.org}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Leadership & Activities</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: 'President', org: 'Youth United Council of India', period: 'Aug 2022 - Oct 2022', showPeriod: true },
              { role: 'Vice President', org: 'Youth United Council of India', period: 'May 2022 - Aug 2022', showPeriod: true },
              { role: 'Organizer', org: 'Hostel Library Inauguration', period: 'GCE-Erode', showPeriod: false },
              { role: 'Coordinator', org: '35th Grand Alumni Function', period: 'GCE-Erode', showPeriod: false },
              { role: 'Member', org: 'Leo Club', period: 'GCE-Erode', showPeriod: false },
              { role: 'Team Lead', org: 'Mime and Tableau teams', period: 'GCE-Erode', showPeriod: false }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{item.role}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">{item.org}</p>
                  {item.showPeriod && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{item.period}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Email</h3>
                <div className="min-w-0 flex-1">
                  <a
                    href="mailto:vidhyasriprakasan@gmail.com"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 truncate block"
                    title="vidhyasriprakasan@gmail.com"
                  >
                    vidhyasriprakasan@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Phone</h3>
                <a
                  href="tel:+919600708314"
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                >
                  +91 9600708314
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Location</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Namakkal, Tamil Nadu, India</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Linkedin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">LinkedIn</h3>
                <a
                  href="https://linkedin.com/in/vidhyasri-prakasan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Vidhyasri Prakasan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-300">
              &copy; 2025 Vidhyasri Prakasan. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://linkedin.com/in/vidhyasri-prakasan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/poppyvidhya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="mailto:vidhyasriprakasan@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;