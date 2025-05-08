"use client";

import Head from 'next/head';
import type { ReactNode } from 'react';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaidIcon, CakeIcon, SushiIcon, DonutIcon, BittenAppleIcon, CherryIcon, PrincessIcon } from '@/components/icons';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";


const GAME_DURATION = 60; // seconds
const FOOD_SPAWN_INTERVAL = 1800; // ms
const MAX_FOOD_ITEMS = 8; 
const CHARACTER_STEP = 25; // pixels
const PARTICLE_DURATION = 400; // ms
const MAX_PARTICLES_DISPLAYED = 15; // Increased slightly for more visual feedback
const MAX_PRINCESS_SCALE = 2; 
const PRINCESS_SCALE_INCREMENT = 0.05; 
const MOVEMENT_SMOOTHING_FACTOR = 0.7; // Lower for more smoothing, 1 for no smoothing
const MOVEMENT_THRESHOLD = 0.1; // Minimum distance to move before updating visual position


interface FoodItemType {
  id: string;
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
  id: string;
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
          onClick={(e) => { e.preventDefault(); onMove('up');}} // Keep onClick for accessibility/testing
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
  const targetPositionRef = useRef({ x: 50, y: 50 }); // For smoothed movement
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showControls, setShowControls] = useState(false); // Initially false
  const [particles, setParticles] = useState<Particle[]>([]);
  const [princessScale, setPrincessScale] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const animationFrameId = useRef<number | null>(null);
  const firstMountRef = useRef(true);

  // Refs for game state to use in callbacks without stale closures
  const timeLeftRef = useRef(timeLeft);
  const gameOverRef = useRef(gameOver);
  const foodItemsRef = useRef(foodItems);
  const scoreRef = useRef(score);
  const characterPositionRef = useRef(characterPosition); // Visual position

  // Sound Hooks
  const { play: playMoveSound } = useSound('move', { volume: 0.2, isMutedGlobal: isMuted });
  const { play: playGameOverSound } = useSound('gameOver', { volume: 0.6, isMutedGlobal: isMuted });
  const { play: playBackgroundMusic, stop: stopBackgroundMusic, isPlaying: isMusicPlaying } = useSound('backgroundMusic', { volume: 0.1, loop: true, isMutedGlobal: isMuted });
  
  const foodSoundVolume = 0.6;
  const { play: playChewSound } = useSound('chew', { volume: foodSoundVolume - 0.1, isMutedGlobal: isMuted });
  const { play: playCakeVoiceSound } = useSound('cakeVoice', { volume: foodSoundVolume, isMutedGlobal: isMuted });
  const { play: playSushiVoiceSound } = useSound('sushiVoice', { volume: foodSoundVolume, isMutedGlobal: isMuted });
  const { play: playDonutVoiceSound } = useSound('donutVoice', { volume: foodSoundVolume, isMutedGlobal: isMuted });
  const { play: playAppleVoiceSound } = useSound('appleVoice', { volume: foodSoundVolume, isMutedGlobal: isMuted });
  const { play: playCherryVoiceSound } = useSound('cherryVoice', { volume: foodSoundVolume, isMutedGlobal: isMuted });

  useEffect(() => {
    setIsClient(true);
    // Show controls by default on touch devices, allow toggle for PC
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setShowControls(true);
    }
  }, []);

  // Sync refs with state
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { foodItemsRef.current = foodItems; }, [foodItems]);
  useEffect(() => {
    scoreRef.current = score;
    // Ensure princess scale always increases with score, capped at MAX_PRINCESS_SCALE
    setPrincessScale(prevScale => Math.min(MAX_PRINCESS_SCALE, 1 + (scoreRef.current * PRINCESS_SCALE_INCREMENT / 10)));
  }, [score]); // Only depends on score
  
  useEffect(() => { characterPositionRef.current = characterPosition;}, [characterPosition]);

  // Background Music Management
  useEffect(() => {
    if (isClient && !gameOverRef.current && !isMusicPlaying && !isMuted) {
      playBackgroundMusic();
    } else if (isClient && (gameOverRef.current || isMuted) && isMusicPlaying) {
      stopBackgroundMusic();
    }
    return () => { if (isMusicPlaying) stopBackgroundMusic(); };
  }, [isClient, gameOver, playBackgroundMusic, stopBackgroundMusic, isMusicPlaying, isMuted]);

  const addParticles = useCallback((x: number, y: number) => {
    const newParticle: Particle = { 
      id: `particle-${Date.now()}-${performance.now()}-${Math.random().toString(36).substring(2, 15)}`, 
      x, 
      y, 
      createdAt: Date.now() 
    };
    setParticles(prev => [...prev.slice(-MAX_PARTICLES_DISPLAYED), newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, PARTICLE_DURATION);
  }, []); // setParticles is stable

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOverRef.current || !gameAreaRef.current) return;
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    if (gameAreaRect.width <= 0 || gameAreaRect.height <= 0) return;

    targetPositionRef.current = (prevTarget => {
        let newX = prevTarget.x;
        let newY = prevTarget.y;
        const step = CHARACTER_STEP;

        if (direction === 'up') newY -= step;
        if (direction === 'down') newY += step;
        if (direction === 'left') newX -= step;
        if (direction === 'right') newX += step;

        newX = Math.max(0, Math.min(gameAreaRect.width - 50, newX)); // 50 is character width
        newY = Math.max(0, Math.min(gameAreaRect.height - 50, newY)); // 50 is character height
        
        if (newX !== prevTarget.x || newY !== prevTarget.y) {
            playMoveSound(); // Play move sound on intention, not on visual update
        }
        return { x: newX, y: newY };
    })(targetPositionRef.current);

  }, [playMoveSound]); 
  
  // Game loop for smoothed movement & particle generation
  useEffect(() => {
    const gameLoop = () => {
      if (gameOverRef.current) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        return;
      }

      setCharacterPosition(prevVisualPos => {
        const dx = targetPositionRef.current.x - prevVisualPos.x;
        const dy = targetPositionRef.current.y - prevVisualPos.y;

        let nextX = prevVisualPos.x;
        let nextY = prevVisualPos.y;

        if (Math.abs(dx) > MOVEMENT_THRESHOLD || Math.abs(dy) > MOVEMENT_THRESHOLD) {
          nextX = prevVisualPos.x + dx * (1 - MOVEMENT_SMOOTHING_FACTOR);
          nextY = prevVisualPos.y + dy * (1 - MOVEMENT_SMOOTHING_FACTOR);
          
          // Add particles if character has moved significantly
          if(Math.sqrt(dx*dx + dy*dy) > CHARACTER_STEP / 4) { // Add particles if moved a quarter step
             addParticles(nextX + 25, nextY + 25); // 25 is half of character width/height
          }
        } else {
          // Snap to target if very close to avoid jitter
          nextX = targetPositionRef.current.x;
          nextY = targetPositionRef.current.y;
        }
        return { x: nextX, y: nextY };
      });
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    if (isClient && !gameOverRef.current) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isClient, gameOver, addParticles]);


  // Keyboard controls
  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOverRef.current) return;
        let moved = false;
        if (e.key === 'ArrowUp') { handleMove('up'); moved = true;}
        else if (e.key === 'ArrowDown') { handleMove('down'); moved = true;}
        else if (e.key === 'ArrowLeft') { handleMove('left'); moved = true;}
        else if (e.key === 'ArrowRight') { handleMove('right'); moved = true;}
        if (moved) e.preventDefault();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, handleMove]);


  // Food spawning
  useEffect(() => {
    if (!isClient) return;
    let spawnIntervalId: NodeJS.Timeout;

    const spawnFood = () => {
      if (gameOverRef.current || !gameAreaRef.current || foodItemsRef.current.length >= MAX_FOOD_ITEMS) return;
      const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
       if (gameAreaRect.width <= 0 || gameAreaRect.height <=0) return;

      setFoodItems(prevFoodItems => {
         if (prevFoodItems.length < MAX_FOOD_ITEMS ) {
          const newFoodItem = {
            id: `food-${Date.now()}-${performance.now()}-${Math.random().toString(36).substring(2, 15)}`,
            x: Math.random() * (gameAreaRect.width - 30), // 30 is food width
            y: Math.random() * (gameAreaRect.height - 30), // 30 is food height
            type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
          };
          return [...prevFoodItems, newFoodItem];
        }
        return prevFoodItems;
      });
    };

    if (!gameOverRef.current) {
      spawnFood(); 
      spawnIntervalId = setInterval(spawnFood, FOOD_SPAWN_INTERVAL);
    }
    
    return () => clearInterval(spawnIntervalId);
  }, [isClient, gameOver]); 


  // Game timer
  useEffect(() => {
    if (!isClient || gameOverRef.current) return;

    const timer = setInterval(() => {
      if (timeLeftRef.current <= 1) {
          setGameOver(true); // This will trigger gameOverRef.current update
          setTimeLeft(0);
          clearInterval(timer);
          if (isMusicPlaying) stopBackgroundMusic();
          playGameOverSound();
          toast({
            title: "Time's Up!",
            description: `Game Over! Your score: ${scoreRef.current}`, // Use ref for final score
            duration: 5000,
          });
      } else {
          setTimeLeft(prevTime => prevTime - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient, gameOver, toast, playGameOverSound, stopBackgroundMusic, isMusicPlaying]); // setTimeLeft and setGameOver are stable


  // Food collection logic
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
        
        playChewSound(); // Play generic chew sound first
        // Then specific voice
        switch (food.type.name) {
          case 'Cake': playCakeVoiceSound(); break;
          case 'Sushi': playSushiVoiceSound(); break;
          case 'Donut': playDonutVoiceSound(); break;
          case 'Apple': playAppleVoiceSound(); break;
          case 'Cherry': playCherryVoiceSound(); break;
          default: break;
        }
        
        toast({
            description: (<span>Collected {food.type.name}! <strong className="text-accent-foreground/80">(+{food.type.points})</strong></span>) as ReactNode,
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
  }, [
      isClient, 
      characterPosition, // Visual position, used for collision
      foodItems,         // Current food items
      playChewSound, playCakeVoiceSound, playSushiVoiceSound, playDonutVoiceSound, playAppleVoiceSound, playCherryVoiceSound,
      toast, // Stable from useToast
      // setFoodItems, setScore are stable setters
    ]);


  const restartGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoodItems([]);
    setGameOver(false);
    setPrincessScale(1); // Reset princess scale
    setParticles([]); 
    
    const initialPos = { x: 50, y: 50 };
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
       if (rect.width > 0 && rect.height > 0) {
        initialPos.x = rect.width / 2 - 25;
        initialPos.y = rect.height / 2 - 25;
      }
    }
    targetPositionRef.current = initialPos; // Reset target position
    setCharacterPosition(initialPos);      // Reset visual position

    if (!isMusicPlaying && !isMuted) { 
        playBackgroundMusic();
    }
     toast({
        title: "Game Started!",
        description: "Collect as much food as you can!",
        duration: 3000,
    });
  }, [playBackgroundMusic, isMusicPlaying, toast, isMuted]); // All dependencies are stable or primitive


  // Initial game start
  useEffect(() => {
    if (isClient && firstMountRef.current) {
      restartGame();
      firstMountRef.current = false;
    }
  }, [isClient, restartGame]);


  // Memoized character style for performance
  const characterStyle = useMemo(() => ({
    position: 'absolute' as const,
    width: '50px',
    height: '50px',
    zIndex: 10,
    // transform is set directly via style prop by motion.div
    willChange: 'transform',
  }), []); // Empty deps as x,y are handled by motion component

  const princessStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    width: '60px', // Base width
    height: '90px', // Base height
    zIndex: 5,
    transform: `scale(${princessScale})`,
    transformOrigin: 'top left',
    transition: 'transform 0.3s ease-out',
    willChange: 'transform',
  }), [princessScale]);


  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-secondary"><p className="text-2xl text-primary">Loading Game...</p></div>;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center maid-mayhem-font select-none bg-secondary p-2 sm:p-4"
      style={{ WebkitTapHighlightColor: 'transparent' }}
      role="application"
    >
      <Head >
        <title>Maid Mayhem</title>
        <meta name="description" content="Collect food items as a minion maid doll!" />
        {/* <link rel="icon" href="/maid.svg" /> You may add your favicon here */}
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
            onClick={() => setIsMuted(prev => {
              const newMutedState = !prev;
              if (newMutedState && isMusicPlaying) stopBackgroundMusic();
              else if (!newMutedState && !isMusicPlaying && !gameOverRef.current) playBackgroundMusic();
              return newMutedState;
            })}
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
        {/* Princess Character */}
        <div
            style={princessStyle}
            role="img"
            aria-label="Princess character that grows when food is collected"
        >
            <PrincessIcon className="w-full h-full text-pink-400 drop-shadow-md" data-ai-hint="princess character" />
        </div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id} // Unique key is crucial
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.5 }}
              exit={{ opacity: 0 }} 
              transition={{ duration: PARTICLE_DURATION / 1000, ease: "easeOut" }}
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
          style={{
            ...characterStyle, // Base style (width, height, zIndex, position)
            x: characterPosition.x, // Motion value for x
            y: characterPosition.y, // Motion value for y
          }}
          // No transition prop here for direct RAF control
          className="flex items-center justify-center"
          role="img"
          aria-label="Maid character controlled by player"
        >
           <MaidIcon className="w-full h-full text-primary drop-shadow-lg" data-ai-hint="maid doll"/>
        </motion.div>

        {/* Food Items */}
        {foodItems.map(food => (
          <div
            key={food.id} // Unique key is crucial
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

      {/* Game Over Dialog */}
      {gameOver && (
        <AlertDialog open={gameOver} onOpenChange={(open) => { if(!open) restartGame(); }}>
          <AlertDialogContent className="bg-background/90 border-primary shadow-2xl rounded-2xl backdrop-blur-md">
            <AlertDialogHeader className="items-center">
              <AlertDialogTitle className="text-3xl text-primary">Game Over!</AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-foreground text-center">
                Your final score is {scoreRef.current}. {/* Use ref for final score */}
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
      {/* Touch Controls - Conditionally render based on showControls and !gameOver */}
      {!gameOver && showControls && <TouchControls onMove={handleMove} />}
    </div>
  );
}

