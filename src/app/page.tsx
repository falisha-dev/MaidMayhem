"use client";

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      
      newX = Math.max(0, Math.min(window.innerWidth - 50, newX)); // 50 is character width
      newY = Math.max(0, Math.min(window.innerHeight - 50, newY)); // 50 is character height
      
      return { x: newX, y: newY };
    });
  }, [isClient, gameOver]);

  // Keyboard controls
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        let newX = characterPosition.x;
        let newY = characterPosition.y;
        const step = CHARACTER_STEP;
        
        if (e.key === 'ArrowUp') newY -= step;
        if (e.key === 'ArrowDown') newY += step;
        if (e.key === 'ArrowLeft') newX -= step;
        if (e.key === 'ArrowRight') newX += step;
        else return;

        newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 50, newY));
        setCharacterPosition({ x: newX, y: newY });
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    
  }, [isClient, characterPosition.x, characterPosition.y, gameOver]);

  // Spawn food items
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      if (foodItems.length < MAX_FOOD_ITEMS && timeLeft > 0 && !gameOver) {
        setFoodItems(prevItems => [
          ...prevItems,
          {
            id: Date.now() + Math.random(), // Ensure unique ID
            x: Math.random() * (window.innerWidth - 30), // 30 is food width
            y: Math.random() * (window.innerHeight - 30), // 30 is food height
            type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
          }
        ]);
      }
    }, FOOD_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isClient, foodItems.length, timeLeft, gameOver]);

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
    setCharacterPosition({ x: window.innerWidth / 2 - 25 , y: window.innerHeight / 2 - 25 });
    setGameOver(false);
  };

  useEffect(() => { // Center character on game start/restart
    if (isClient) {
      setCharacterPosition({ x: window.innerWidth / 2 - 25 , y: window.innerHeight / 2 - 25 });
    }
  }, [isClient, gameOver]);


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }
  
  const TouchControls = () => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20" aria-label="Touch controls">
      <Button
        className="p-3 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg"
        onTouchStart={(e) => { e.preventDefault(); moveCharacter('up');}}
        onClick={() => moveCharacter('up')} // For mouse interaction on desktop
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
      
      <main className="w-full h-full" aria-hidden="true"> {/* Game area, controls handled separately */}
        <div
          style={{
            position: 'absolute',
            left: characterPosition.x,
            top: characterPosition.y,
            width: '50px',
            height: '50px',
            transition: 'left 0.05s linear, top 0.05s linear', // Faster transition for smoother movement
          }}
          className="flex items-center justify-center"
          role="img" // Changed to img for semantic representation of character
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
            role="img" // Changed to img for semantic representation of food
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
