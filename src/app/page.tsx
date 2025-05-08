"use client";

import Head from 'next/head';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaidIcon, CakeIcon, SushiIcon, DonutIcon, BittenAppleIcon, CherryIcon, PrincessIcon } from '@/components/icons';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";


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

// TouchControls Component (Memoized)
interface TouchControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const TouchControls = React.memo(({ onMove }: TouchControlsProps) => (
  <div
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 grid grid-cols-3 grid-rows-3 w-fit gap-1 z-20"
      aria-label="Touch controls D-pad"
      style={{ WebkitTapHighlightColor: 'transparent' }}
  >
      <Button
          className="col-start-2 row-start-1 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); onMove('up');}}
          onClick={(e) => { e.preventDefault(); onMove('up');}}
          aria-label="Move Up"
      >
          <ArrowUp size={28} />
      </Button>
      <Button
          className="col-start-1 row-start-2 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); onMove('left');}}
          onClick={(e) => { e.preventDefault(); onMove('left');}}
          aria-label="Move Left"
      >
          <ArrowLeft size={28} />
      </Button>
      <Button
          className="col-start-3 row-start-2 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); onMove('right');}}
          onClick={(e) => { e.preventDefault(); onMove('right');}}
          aria-label="Move Right"
      >
          <ArrowRight size={28} />
      </Button>
      <Button
          className="col-start-2 row-start-3 p-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); onMove('down');}}
          onClick={(e) => { e.preventDefault(); onMove('down');}}
          aria-label="Move Down"
      >
          <ArrowDown size={28} />
      </Button>
  </div>
));
TouchControls.displayName = "TouchControls";


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
  const [isMuted, setIsMuted] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const particleIdCounter = useRef(0);
  const firstMountRef = useRef(true);

  const timeLeftRef = useRef(timeLeft);
  const gameOverRef = useRef(gameOver);
  const foodItemsRef = useRef(foodItems);
  const scoreRef = useRef(score);
  const characterPositionRef = useRef(characterPosition);

  const { play: playCollectSound } = useSound('collect', { volume: 0.5, isMutedGlobal: isMuted });
  const { play: playMoveSound } = useSound('move', { volume: 0.3, isMutedGlobal: isMuted });
  const { play: playGameOverSound } = useSound('gameOver', { volume: 0.7, isMutedGlobal: isMuted });
  const { play: playBackgroundMusic, stop: stopBackgroundMusic, isPlaying: isMusicPlaying } = useSound('backgroundMusic', { volume: 0.2, loop: true, isMutedGlobal: isMuted });

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setShowControls(true);
    }
  }, []);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { foodItemsRef.current = foodItems; }, [foodItems]);
  useEffect(() => {
    scoreRef.current = score;
    setPrincessScale(prevScale => Math.min(MAX_PRINCESS_SCALE, 1 + (score * PRINCESS_SCALE_INCREMENT / 10)));
  }, [score]);
  useEffect(() => { characterPositionRef.current = characterPosition; }, [characterPosition]);

  useEffect(() => {
    if (isClient && !gameOverRef.current && !isMusicPlaying) {
      playBackgroundMusic();
    } else if (isClient && gameOverRef.current && isMusicPlaying) {
      stopBackgroundMusic();
    }
    return () => { if (isMusicPlaying) stopBackgroundMusic(); };
  }, [isClient, gameOver, playBackgroundMusic, stopBackgroundMusic, isMusicPlaying]);


  const addParticles = useCallback((x: number, y: number) => {
    particleIdCounter.current += 1;
    const newParticle: Particle = { id: particleIdCounter.current, x, y, createdAt: Date.now() };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, PARTICLE_DURATION);
  }, [setParticles]);


  const moveCharacter = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOverRef.current || !gameAreaRef.current) return;
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    if (gameAreaRect.width <= 0 || gameAreaRect.height <= 0) return;

    setCharacterPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const step = CHARACTER_STEP;

      if (direction === 'up') newY -= step;
      if (direction === 'down') newY += step;
      if (direction === 'left') newX -= step;
      if (direction === 'right') newX += step;

      newX = Math.max(0, Math.min(gameAreaRect.width - 50, newX));
      newY = Math.max(0, Math.min(gameAreaRect.height - 50, newY));

      if (newX !== prev.x || newY !== prev.y) {
        addParticles(newX + 25, newY + 25);
        playMoveSound();
      }
      return { x: newX, y: newY };
    });
  }, [playMoveSound, addParticles]);


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


  useEffect(() => {
    if (!isClient) return;
    const spawnFood = () => {
      if (gameOverRef.current || !gameAreaRef.current || foodItemsRef.current.length >= MAX_FOOD_ITEMS) return;
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
    if (!gameOverRef.current) spawnFood(); // Initial spawn if not game over
    return () => clearInterval(interval);
  }, [isClient, gameOver]);


  useEffect(() => {
    if (!isClient || gameOverRef.current) return;

    const timer = setInterval(() => {
      if (timeLeftRef.current <= 1) {
          setGameOver(true);
          setTimeLeft(0);
          clearInterval(timer);
          stopBackgroundMusic();
          playGameOverSound();
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
  }, [isClient, gameOver, toast, playGameOverSound, stopBackgroundMusic, setTimeLeft, setGameOver]);


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
        playCollectSound();
        toast({
            description: `Collected ${food.type.name}! +${food.type.points}`,
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
  }, [isClient, characterPosition, foodItems, score, toast, playCollectSound, setFoodItems, setScore]);


  const restartGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoodItems([]);
    setGameOver(false);
    setPrincessScale(1);
    particleIdCounter.current = 0; 
    
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
       if (rect.width > 0 && rect.height > 0) {
        const newCenterPos = { x: rect.width / 2 - 25 , y: rect.height / 2 - 25 };
        setCharacterPosition(newCenterPos);
        characterPositionRef.current = newCenterPos; // Keep ref in sync
      } else {
        // Fallback if rect not ready, though less likely now with initial restartGame call
        const fallbackPos = { x: 50, y: 50};
        setCharacterPosition(fallbackPos);
        characterPositionRef.current = fallbackPos;
      }
    } else {
        const fallbackPos = { x: 50, y: 50};
        setCharacterPosition(fallbackPos);
        characterPositionRef.current = fallbackPos;
    }

    if (!isMusicPlaying) {
        playBackgroundMusic();
    }
     toast({
        title: "Game Started!",
        description: "Collect as much food as you can!",
        duration: 3000,
    });
  }, [setScore, setTimeLeft, setFoodItems, setGameOver, setPrincessScale, setCharacterPosition, playBackgroundMusic, isMusicPlaying, toast]);


  useEffect(() => {
    if (isClient && firstMountRef.current) {
      restartGame();
      firstMountRef.current = false;
    }
  }, [isClient, restartGame]);


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center maid-mayhem-font select-none bg-secondary p-2 sm:p-4"
      style={{ WebkitTapHighlightColor: 'transparent' }}
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
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 rounded-lg bg-primary/70 hover:bg-primary text-primary-foreground shadow-lg"
            onClick={() => setIsMuted(prev => !prev)}
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </Button>
        </div>
      </header>

      <main
        ref={gameAreaRef}
        className="relative w-full h-[calc(100%-100px)] sm:h-[calc(100%-120px)] max-w-screen-lg bg-background/30 rounded-xl shadow-2xl overflow-hidden border-2 border-primary/50 backdrop-blur-sm"
        aria-hidden="true"
      >
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
      {!gameOver && showControls && <TouchControls onMove={moveCharacter} />}
    </div>
  );
}

