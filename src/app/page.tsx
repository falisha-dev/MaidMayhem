
"use client";

import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaidIcon, CakeIcon, SushiIcon, DonutIcon, BittenAppleIcon, CherryIcon, PrincessIcon } from '@/components/icons';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";


const GAME_DURATION = 60; // seconds
const FOOD_SPAWN_INTERVAL = 2000; // ms
const MAX_FOOD_ITEMS = 10;
const CHARACTER_STEP = 20; // pixels
const PARTICLE_DURATION = 500; // ms
const MAX_PRINCESS_SCALE = 2; // Maximum scale for the princess
const PRINCESS_SCALE_INCREMENT = 0.05; // How much the princess grows per food item

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

interface Particle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
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
  const [showControls, setShowControls] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [princessScale, setPrincessScale] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  // Refs for state values used in intervals/event listeners
  const timeLeftRef = useRef(timeLeft);
  const gameOverRef = useRef(gameOver);
  const foodItemsRef = useRef(foodItems);
  const scoreRef = useRef(score);
  const characterPositionRef = useRef(characterPosition);


  useEffect(() => {
    setIsClient(true);
    // Show controls by default on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setShowControls(true);
    }
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
    // Update princess scale based on score
    setPrincessScale(prevScale => Math.min(MAX_PRINCESS_SCALE, 1 + (score * PRINCESS_SCALE_INCREMENT / 10))); 
  }, [score]);

  useEffect(() => {
    characterPositionRef.current = characterPosition;
  }, [characterPosition]);


  const addParticles = (x: number, y: number) => {
    const newParticle: Particle = { id: Date.now() + Math.random(), x, y, createdAt: Date.now() };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, PARTICLE_DURATION);
  };


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
      
      newX = Math.max(0, Math.min(gameAreaRect.width - 50, newX)); // 50 is character width
      newY = Math.max(0, Math.min(gameAreaRect.height - 50, newY)); // 50 is character height
      
      if (newX !== prev.x || newY !== prev.y) { 
        addParticles(newX + 25, newY + 25); 
      }
      return { x: newX, y: newY };
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOverRef.current) return;
        
        if (e.key === 'ArrowUp') { e.preventDefault(); moveCharacter('up'); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); moveCharacter('down'); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); moveCharacter('left'); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveCharacter('right'); }
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
       if (gameAreaRect.width <= 0 || gameAreaRect.height <=0) return; 
      
      setFoodItems(prevFoodItems => {
         if (prevFoodItems.length < MAX_FOOD_ITEMS ) { 
          const newFoodItem = {
            id: Date.now() + Math.random(),
            x: Math.random() * (gameAreaRect.width - 30), 
            y: Math.random() * (gameAreaRect.height - 30), 
            type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
          };
          return [...prevFoodItems, newFoodItem];
        }
        return prevFoodItems;
      });
    };

    const interval = setInterval(spawnFood, FOOD_SPAWN_INTERVAL);
    spawnFood(); 
    return () => clearInterval(interval);
  }, [isClient, gameOver]); 

  // Timer
  useEffect(() => {
    if (!isClient) return;
    if (timeLeftRef.current <= 0 && !gameOverRef.current) {
      setGameOver(true);
      return;
    }
    if (gameOverRef.current) return;

    const timer = setInterval(() => {
      if (timeLeftRef.current <= 1) {
          setGameOver(true);
          setTimeLeft(0); 
          clearInterval(timer);
          toast({
            title: "Time's Up!",
            description: `Game Over! Your score: ${scoreRef.current}`,
            duration: 5000,
          });
      } else {
          setTimeLeft(prevTime => prevTime - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient, gameOver, toast]); 

  // Collision detection
  useEffect(() => {
    if (!isClient || gameOverRef.current) return;

    const charRect = { x: characterPositionRef.current.x, y: characterPositionRef.current.y, width: 50, height: 50 };
    let itemsCollectedThisFrame = 0;
    let pointsCollectedThisFrame = 0;

    const newFoodItems = foodItemsRef.current.filter(food => {
      const foodRect = { x: food.x, y: food.y, width: 30, height: 30 };

      if (
        charRect.x < foodRect.x + foodRect.width &&
        charRect.x + charRect.width > foodRect.x &&
        charRect.y < foodRect.y + foodRect.height &&
        charRect.y + charRect.height > foodRect.y
      ) {
        pointsCollectedThisFrame += food.type.points;
        itemsCollectedThisFrame++;
        toast({
            description: `Collected ${food.type.name}! +${food.type.points} points`,
            duration: 1500,
        });
        return false; 
      }
      return true; 
    });

    if (itemsCollectedThisFrame > 0) {
        setFoodItems(newFoodItems);
        setScore(prevScore => prevScore + pointsCollectedThisFrame);
    }

  }, [isClient, characterPosition, toast]); 
  
  const restartGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_DURATION);
    timeLeftRef.current = GAME_DURATION;
    setFoodItems([]); 
    foodItemsRef.current = [];
    setGameOver(false); 
    gameOverRef.current = false;
    setPrincessScale(1);
    if (gameAreaRef.current) { 
      const rect = gameAreaRef.current.getBoundingClientRect();
       if (rect.width > 0 && rect.height > 0) { 
        setCharacterPosition({ x: rect.width / 2 - 25 , y: rect.height / 2 - 25 });
        characterPositionRef.current = { x: rect.width / 2 - 25 , y: rect.height / 2 - 25 };
      }
    }
     toast({
        title: "Game Started!",
        description: "Collect as much food as you can!",
        duration: 3000,
    });
  };

  useEffect(() => { 
    if (isClient && gameAreaRef.current) {
      const calculateCenter = () => {
        if (gameAreaRef.current) {
          const rect = gameAreaRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
             setCharacterPosition({ x: rect.width / 2 - 25 , y: rect.height / 2 - 25 });
             characterPositionRef.current = { x: rect.width / 2 - 25 , y: rect.height / 2 - 25 };
          } else {
            setTimeout(calculateCenter, 100);
          }
        }
      };
      calculateCenter();
    }
  }, [isClient, gameOver]);


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }
  
  const TouchControls = () => (
    <div 
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 grid grid-cols-3 grid-rows-3 w-fit gap-1 z-20"
        aria-label="Touch controls D-pad"
        style={{ WebkitTapHighlightColor: 'transparent' }}
    >
        <Button
            className="col-start-2 row-start-1 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('up');}}
            onClick={(e) => { e.preventDefault(); moveCharacter('up');}}
            aria-label="Move Up"
        >
            <ArrowUp size={28} />
        </Button>
        <Button
            className="col-start-1 row-start-2 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('left');}}
            onClick={(e) => { e.preventDefault(); moveCharacter('left');}}
            aria-label="Move Left"
        >
            <ArrowLeft size={28} />
        </Button>
        <Button
            className="col-start-3 row-start-2 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('right');}}
            onClick={(e) => { e.preventDefault(); moveCharacter('right');}}
            aria-label="Move Right"
        >
            <ArrowRight size={28} />
        </Button>
        <Button
            className="col-start-2 row-start-3 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            onTouchStart={(e) => { e.preventDefault(); moveCharacter('down');}}
            onClick={(e) => { e.preventDefault(); moveCharacter('down');}}
            aria-label="Move Down"
        >
            <ArrowDown size={28} />
        </Button>
    </div>
  );


  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center maid-mayhem-font select-none bg-secondary p-2 sm:p-4"
      style={{ 
        WebkitTapHighlightColor: 'transparent' 
      }}
    >
      <Head>
        <title>Maid Mayhem</title>
        <meta name="description" content="Collect food items as a minion maid doll!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <header className="w-full max-w-screen-lg mb-2 sm:mb-4 flex justify-between items-center z-10 px-2">
        <h1 className="text-xl sm:text-3xl font-bold text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Maid Mayhem</h1>
        <div className="flex gap-2 sm:gap-4 items-center">
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
            onClick={() => setShowControls(prev => !prev)}
            aria-label={showControls ? "Hide touch controls" : "Show touch controls"}
          >
            <Gamepad2 size={24}/>
          </Button>
        </div>
      </header>
      
      <main 
        ref={gameAreaRef} 
        className="relative w-full h-[calc(100%-100px)] sm:h-[calc(100%-120px)] max-w-screen-lg bg-background/30 rounded-xl shadow-2xl overflow-hidden border-2 border-primary/50 backdrop-blur-sm"
        aria-hidden="true" 
      >
        {/* Princess Character */}
        <div 
            style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '60px', 
                height: '90px', 
                zIndex: 5, 
                transform: `scale(${princessScale})`,
                transformOrigin: 'top left',
                transition: 'transform 0.3s ease-out',
            }}
            role="img"
            aria-label="Princess character that grows when food is collected"
        >
            <PrincessIcon className="w-full h-full text-pink-400 drop-shadow-md" />
        </div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: PARTICLE_DURATION / 1000 }}
              style={{
                position: 'absolute',
                left: particle.x - 5, 
                top: particle.y - 5,  
                width: '10px',
                height: '10px',
              }}
              className="pointer-events-none z-0" 
            >
              <Sparkles className="w-full h-full text-accent" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Character */}
        <motion.div
          animate={{ x: characterPosition.x, y: characterPosition.y }}
          transition={{ type: "spring", stiffness: 700, damping: 35, mass: 0.5 }}
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            zIndex: 10,
          }}
          className="flex items-center justify-center"
          role="img"
          aria-label="Maid character controlled by player"
        >
           <MaidIcon className="w-full h-full text-primary drop-shadow-lg" />
        </motion.div>

        {/* Food Items */}
        {foodItems.map(food => (
          <div
            key={food.id}
            style={{
              position: 'absolute',
              left: food.x,
              top: food.y,
              width: '30px',
              height: '30px',
              zIndex: 1, 
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
        <AlertDialog open={gameOver} onOpenChange={(open) => { if(!open) restartGame(); }}>
          <AlertDialogContent className="bg-background/90 border-primary shadow-2xl rounded-2xl backdrop-blur-md">
            <AlertDialogHeader className="items-center">
              <AlertDialogTitle className="text-3xl text-primary">Game Over!</AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-foreground text-center">
                Your final score is {scoreRef.current}.
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
      {!gameOver && showControls && <TouchControls />}
    </div>
  );
}
