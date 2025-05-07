
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
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Refs for state values used in intervals/event listeners
  const timeLeftRef = useRef(timeLeft);
  const gameOverRef = useRef(gameOver);
  const foodItemsRef = useRef(foodItems);
  const scoreRef = useRef(score);
  const characterPositionRef = useRef(characterPosition);


  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update refs when state changes
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    foodItemsRef.current = foodItems;
  }, [foodItems]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    characterPositionRef.current = characterPosition;
  }, [characterPosition]);


  const moveCharacter = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOverRef.current || !gameAreaRef.current) return;
    
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();

    setCharacterPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const step = CHARACTER_STEP;

      if (direction === 'up') newY -= step;
      if (direction === 'down') newY += step;
      if (direction === 'left') newX -= step;
      if (direction === 'right') newX += step;
      
      // Ensure character stays within the game area bounds
      // Character size is 50x50
      newX = Math.max(0, Math.min(gameAreaRect.width - 50, newX));
      newY = Math.max(0, Math.min(gameAreaRect.height - 50, newY));
      
      return { x: newX, y: newY };
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOverRef.current) return;
        
        if (e.key === 'ArrowUp') moveCharacter('up');
        else if (e.key === 'ArrowDown') moveCharacter('down');
        else if (e.key === 'ArrowLeft') moveCharacter('left');
        else if (e.key === 'ArrowRight') moveCharacter('right');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    
  }, [isClient, moveCharacter]);

  // Spawn food items
  useEffect(() => {
    if (!isClient) return;

    const spawnFood = () => {
      if (gameOverRef.current || !gameAreaRef.current || foodItemsRef.current.length >= MAX_FOOD_ITEMS) {
        return;
      }
      
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
      
      // Use a functional update for setFoodItems to ensure it's using the latest state
      setFoodItems(prevFoodItems => {
         if (prevFoodItems.length < MAX_FOOD_ITEMS && gameAreaRect.width > 0 && gameAreaRect.height > 0) { // Ensure game area has dimensions
          return [
            ...prevFoodItems,
            {
              id: Date.now() + Math.random(),
              // Food item size is 30x30
              x: Math.random() * (gameAreaRect.width - 30),
              y: Math.random() * (gameAreaRect.height - 30),
              type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
            }
          ];
        }
        return prevFoodItems;
      });
    };

    const interval = setInterval(spawnFood, FOOD_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isClient]); // Removed gameAreaRef.current from dependencies as it's stable

  // Timer
  useEffect(() => {
    if (!isClient) return;
    if (timeLeftRef.current <= 0 && !gameOverRef.current) {
      setGameOver(true);
      return;
    }
    if (gameOverRef.current) return;

    const timer = setInterval(() => {
      // Use the ref for reading the current time left inside the interval
      if (timeLeftRef.current <= 1) {
          setGameOver(true);
          setTimeLeft(0); // Ensure timeLeft state is also set to 0
          clearInterval(timer);
      } else {
          setTimeLeft(prevTime => prevTime - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

  // Collision detection
  useEffect(() => {
    if (!isClient || gameOverRef.current) return;

    const charRect = { x: characterPositionRef.current.x, y: characterPositionRef.current.y, width: 50, height: 50 };
    let itemsCollected = 0;

    const newFoodItems = foodItemsRef.current.filter(food => {
      const foodRect = { x: food.x, y: food.y, width: 30, height: 30 };

      if (
        charRect.x < foodRect.x + foodRect.width &&
        charRect.x + charRect.width > foodRect.x &&
        charRect.y < foodRect.y + foodRect.height &&
        charRect.y + charRect.height > foodRect.y
      ) {
        setScore(prevScore => prevScore + food.type.points);
        itemsCollected++;
        return false; // Remove collected food
      }
      return true; // Keep uncollected food
    });

    if (itemsCollected > 0) {
        setFoodItems(newFoodItems);
    }

  }, [isClient, characterPosition]); // characterPosition is enough here as refs are for reads inside intervals/event handlers
  
  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoodItems([]); // This will trigger foodItemsRef update
    setGameOver(false); // This will trigger gameOverRef update and the useEffect below
    // Character position is reset by the useEffect below
  };

  useEffect(() => { 
    if (isClient && gameAreaRef.current) {
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
      if (gameAreaRect.width > 0 && gameAreaRect.height > 0) {
        setCharacterPosition({ x: gameAreaRect.width / 2 - 25 , y: gameAreaRect.height / 2 - 25 });
      } else {
         // Fallback or retry logic if gameAreaRect is not ready
        setTimeout(() => {
          if (gameAreaRef.current) {
            const rect = gameAreaRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
               setCharacterPosition({ x: rect.width / 2 - 25 , y: rect.height / 2 - 25 });
            }
          }
        }, 100); // Retry after a short delay
      }
    }
  }, [isClient, gameOver]); // Runs when isClient becomes true, or when gameOver changes


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }
  
  const TouchControls = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-20 sm:hidden" aria-label="Touch controls">
      <Button
        className="p-2 w-14 h-14 rounded-full bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
        onTouchStart={(e) => { e.preventDefault(); moveCharacter('up');}}
        onClick={() => moveCharacter('up')}
        aria-label="Move Up"
      >
        <ArrowUp size={28} />
      </Button>
      <div className="flex gap-10">
        <Button
            className="p-2 w-14 h-14 rounded-full bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('left');}}
            onClick={() => moveCharacter('left')}
            aria-label="Move Left"
        >
            <ArrowLeft size={28} />
        </Button>
        <Button
            className="p-2 w-14 h-14 rounded-full bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('right');}}
            onClick={() => moveCharacter('right')}
            aria-label="Move Right"
        >
            <ArrowRight size={28} />
        </Button>
      </div>
       <Button
            className="p-2 w-14 h-14 rounded-full bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('down');}}
            onClick={() => moveCharacter('down')}
            aria-label="Move Down"
        >
            <ArrowDown size={28} />
        </Button>
    </div>
  );


  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center maid-mayhem-font select-none"
      style={{ 
        WebkitTapHighlightColor: 'transparent' 
      }}
    >
      <Head>
        <title>Maid Mayhem</title>
        <meta name="description" content="Collect food items as a minion maid doll!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <header className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex justify-between items-center z-10">
        <h1 className="text-xl sm:text-3xl font-bold text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Maid Mayhem</h1>
        <div className="flex gap-2 sm:gap-4">
          <Card className="p-2 sm:p-3 bg-accent/80 shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm">
            <CardHeader className="p-0 mb-0.5 sm:mb-1">
              <CardTitle className="text-xs sm:text-lg text-accent-foreground">Score</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-base sm:text-2xl font-bold text-primary-foreground">{score}</p>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 bg-accent/80 shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm">
            <CardHeader className="p-0 mb-0.5 sm:mb-1">
              <CardTitle className="text-xs sm:text-lg text-accent-foreground">Time</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-base sm:text-2xl font-bold text-primary-foreground">{timeLeft}</p>
            </CardContent>
          </Card>
        </div>
      </header>
      
      {/* Game Area */}
      <main 
        ref={gameAreaRef} 
        className="relative w-[calc(100%-2rem)] h-[calc(100%-8rem)] sm:w-[calc(100%-4rem)] sm:h-[calc(100%-10rem)] max-w-screen-lg max-h-[700px] bg-black/10 rounded-xl shadow-2xl overflow-hidden border-2 border-primary/50 backdrop-blur-sm"
        aria-hidden="true"
      >
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
          <AlertDialogContent className="bg-background/90 border-primary shadow-2xl rounded-2xl backdrop-blur-md">
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


    

