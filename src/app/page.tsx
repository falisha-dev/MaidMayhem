"use client";

import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaidIcon, CakeIcon, SushiIcon, DonutIcon, BittenAppleIcon, CherryIcon } from '@/components/icons';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GAME_DURATION = 60; // seconds
const FOOD_SPAWN_INTERVAL = 2000; // ms
const MAX_FOOD_ITEMS = 10;
const CHARACTER_STEP = 20; // pixels

interface FoodItemType {
  id: number;
  x: number;
  y: number;
  type: FoodConfig;
}

interface FoodConfig {
  name: string;
  points: number;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const FOOD_TYPES: FoodConfig[] = [
  { name: 'Cake', points: 10, Icon: CakeIcon },
  { name: 'Sushi', points: 15, Icon: SushiIcon },
  { name: 'Donut', points: 5, Icon: DonutIcon },
  { name: 'Apple', points: 8, Icon: BittenAppleIcon },
  { name: 'Cherry', points: 12, Icon: CherryIcon },
];

export default function MaidMayhemGame() {
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 });
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs for state values used in intervals/event listeners
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update refs when state changes
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const moveCharacter = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isClient || gameOver) return;
    setCharacterPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const step = CHARACTER_STEP;

      if (direction === 'up') newY -= step;
      if (direction === 'down') newY += step;
      if (direction === 'left') newX -= step;
      if (direction === 'right') newX += step;
      
      const gameWidth = window.innerWidth;
      const gameHeight = window.innerHeight;
      newX = Math.max(0, Math.min(gameWidth > 50 ? gameWidth - 50 : 0, newX));
      newY = Math.max(0, Math.min(gameHeight > 50 ? gameHeight - 50 : 0, newY));
      
      return { x: newX, y: newY };
    });
  }, [isClient, gameOver]);

  // Keyboard controls
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        
        if (e.key === 'ArrowUp') moveCharacter('up');
        else if (e.key === 'ArrowDown') moveCharacter('down');
        else if (e.key === 'ArrowLeft') moveCharacter('left');
        else if (e.key === 'ArrowRight') moveCharacter('right');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    
  }, [isClient, gameOver, moveCharacter]);

  // Spawn food items
  useEffect(() => {
    if (!isClient || gameOver) {
      return; // Interval will be cleaned up by the return function if game is over
    }

    const interval = setInterval(() => {
      setFoodItems(prevFoodItems => {
        if (prevFoodItems.length < MAX_FOOD_ITEMS && timeLeftRef.current > 0) {
          const gameWidth = window.innerWidth;
          const gameHeight = window.innerHeight;
          return [
            ...prevFoodItems,
            {
              id: Date.now() + Math.random(),
              x: Math.random() * (gameWidth > 30 ? gameWidth - 30 : 0),
              y: Math.random() * (gameHeight > 30 ? gameHeight - 30 : 0),
              type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
            }
          ];
        }
        return prevFoodItems;
      });
    }, FOOD_SPAWN_INTERVAL);

    return () => clearInterval(interval); // Cleanup interval
  }, [isClient, gameOver]); // Dependencies for setting up/tearing down the interval

  // Timer
  useEffect(() => {
    if (!isClient) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient, timeLeft, gameOver]);

  // Collision detection
  useEffect(() => {
    if (!isClient || gameOver) return;

    foodItems.forEach(food => {
      const charRect = { x: characterPosition.x, y: characterPosition.y, width: 50, height: 50 };
      const foodRect = { x: food.x, y: food.y, width: 30, height: 30 };

      if (
        charRect.x < foodRect.x + foodRect.width &&
        charRect.x + charRect.width > foodRect.x &&
        charRect.y < foodRect.y + foodRect.height &&
        charRect.y + charRect.height > foodRect.y
      ) {
        setScore(prevScore => prevScore + food.type.points);
        setFoodItems(prevItems => prevItems.filter(item => item.id !== food.id));
      }
    });
  }, [isClient, characterPosition, foodItems, gameOver]);
  
  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoodItems([]);
    setGameOver(false);
    // Character position is reset by the useEffect below that depends on `gameOver`
  };

  useEffect(() => { // Center character on game start/restart
    if (isClient) {
      const gameWidth = window.innerWidth;
      const gameHeight = window.innerHeight;
      setCharacterPosition({ x: gameWidth / 2 - 25 , y: gameHeight / 2 - 25 });
    }
  }, [isClient, gameOver]); // Runs when isClient becomes true, or when gameOver changes


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }
  
  const TouchControls = () => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20" aria-label="Touch controls">
      <Button
        className="p-3 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg"
        onTouchStart={(e) => { e.preventDefault(); moveCharacter('up');}}
        onClick={() => moveCharacter('up')}
        aria-label="Move Up"
      >
        <ArrowUp size={32} />
      </Button>
      <div className="flex gap-12">
        <Button
            className="p-3 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('left');}}
            onClick={() => moveCharacter('left')}
            aria-label="Move Left"
        >
            <ArrowLeft size={32} />
        </Button>
        <Button
            className="p-3 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('right');}}
            onClick={() => moveCharacter('right')}
            aria-label="Move Right"
        >
            <ArrowRight size={32} />
        </Button>
      </div>
       <Button
            className="p-3 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('down');}}
            onClick={() => moveCharacter('down')}
            aria-label="Move Down"
        >
            <ArrowDown size={32} />
        </Button>
    </div>
  );


  return (
    <div className="relative w-screen h-screen overflow-hidden bg-secondary flex flex-col items-center justify-center maid-mayhem-font select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
      <Head>
        <title>Maid Mayhem</title>
        <meta name="description" content="Collect food items as a minion maid doll!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary drop-shadow-md">Maid Mayhem</h1>
        <div className="flex gap-2 sm:gap-4">
          <Card className="p-2 sm:p-3 bg-accent/90 shadow-lg rounded-xl">
            <CardHeader className="p-0 mb-1">
              <CardTitle className="text-sm sm:text-lg text-accent-foreground">Score</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-xl sm:text-2xl font-bold text-primary-foreground">{score}</p>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 bg-accent/90 shadow-lg rounded-xl">
            <CardHeader className="p-0 mb-1">
              <CardTitle className="text-sm sm:text-lg text-accent-foreground">Time</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-xl sm:text-2xl font-bold text-primary-foreground">{timeLeft}</p>
            </CardContent>
          </Card>
        </div>
      </header>
      
      <main className="w-full h-full" aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            left: characterPosition.x,
            top: characterPosition.y,
            width: '50px',
            height: '50px',
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
          className="flex items-center justify-center"
          role="img"
          aria-label="Maid character"
        >
           <MaidIcon className="w-full h-full text-primary drop-shadow-lg" />
        </div>

        {foodItems.map(food => (
          <div
            key={food.id}
            style={{
              position: 'absolute',
              left: food.x,
              top: food.y,
              width: '30px',
              height: '30px',
            }}
            className="flex items-center justify-center"
            role="img"
            aria-label={`Collect ${food.type.name}`}
          >
            <food.type.Icon className="w-full h-full text-accent drop-shadow-md animate-pulse" />
          </div>
        ))}
      </main>

      {gameOver && (
        <AlertDialog open={gameOver} onOpenChange={(open) => !open && restartGame()}>
          <AlertDialogContent className="bg-background/95 border-primary shadow-2xl rounded-2xl">
            <AlertDialogHeader className="items-center">
              <AlertDialogTitle className="text-3xl text-primary">Game Over!</AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-foreground text-center">
                Your final score is {score}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <Button onClick={restartGame} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-6 py-3 rounded-lg shadow-md">
                Play Again
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {!gameOver && <TouchControls />}
    </div>
  );
}
