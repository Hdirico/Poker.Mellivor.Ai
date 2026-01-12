import { cn } from "@/lib/utils";
import { PlayingCard } from "./PlayingCard";
import { motion } from "framer-motion";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface PlayerSeatProps {
  name: string;
  chips: number;
  cards?: Card[];
  isActive?: boolean;
  isDealer?: boolean;
  isBigBlind?: boolean;
  isSmallBlind?: boolean;
  isFolded?: boolean;
  bet?: number;
  position: "top" | "top-left" | "top-right" | "left" | "right" | "bottom-left" | "bottom-right" | "bottom";
  showCards?: boolean;
  isDark?: boolean;
  dealOrder?: number;
  dealerPosition?: "top" | "top-left" | "top-right" | "left" | "right" | "bottom-left" | "bottom-right" | "bottom";
  className?: string;
}

const positionClasses: Record<string, string> = {
  "top": "top-0 left-1/2 -translate-x-1/2",
  "top-left": "top-4 left-8",
  "top-right": "top-4 right-8",
  "left": "top-1/2 left-4 -translate-y-1/2",
  "right": "top-1/2 right-4 -translate-y-1/2",
  "bottom-left": "bottom-4 left-8",
  "bottom-right": "bottom-4 right-8",
  "bottom": "bottom-0 left-1/2 -translate-x-1/2",
};

const positionCoords: Record<string, { x: number; y: number }> = {
  "top": { x: 0, y: -100 },
  "top-left": { x: -200, y: -80 },
  "top-right": { x: 200, y: -80 },
  "left": { x: -280, y: 0 },
  "right": { x: 280, y: 0 },
  "bottom-left": { x: -200, y: 80 },
  "bottom-right": { x: 200, y: 80 },
  "bottom": { x: 0, y: 120 },
};

function getDealOrigin(playerPosition: string, dealerPosition: string): { x: number; y: number } {
  const dealer = positionCoords[dealerPosition] || positionCoords["top-right"];
  const player = positionCoords[playerPosition] || { x: 0, y: 0 };
  return {
    x: dealer.x - player.x,
    y: dealer.y - player.y,
  };
}

export function PlayerSeat({
  name,
  chips,
  cards,
  isActive = false,
  isDealer = false,
  isBigBlind = false,
  isSmallBlind = false,
  isFolded = false,
  bet,
  position,
  showCards = false,
  isDark = true,
  dealOrder = 0,
  dealerPosition = "top-right",
  className,
}: PlayerSeatProps) {
  const dealOrigin = getDealOrigin(position, dealerPosition);
  const numPlayers = 5;
  const cardDelayBase = 0.15;
  return (
    <div 
      className={cn(
        "absolute flex flex-col items-center gap-2",
        positionClasses[position],
        isFolded && "opacity-40",
        className
      )}
      data-testid={`player-seat-${position}`}
    >
      <div className="flex gap-1">
        {cards?.map((card, i) => {
          const cardIndex = dealOrder + (i * numPlayers);
          const delay = cardIndex * cardDelayBase + 0.1;
          return (
            <motion.div
              key={i}
              initial={{ 
                y: dealOrigin.y,
                x: dealOrigin.x,
                rotate: -360,
                opacity: 0 
              }}
              animate={{ 
                y: 0, 
                x: 0,
                rotate: 0,
                opacity: 1 
              }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay
              }}
            >
              <PlayingCard
                suit={showCards ? card.suit : undefined}
                rank={showCards ? card.rank : undefined}
                faceDown={!showCards}
                size="sm"
                isDark={isDark}
              />
            </motion.div>
          );
        }) ?? (
          <>
            <div className="w-10 h-14 rounded-lg border border-dashed border-zinc-500/40" />
            <div className="w-10 h-14 rounded-lg border border-dashed border-zinc-500/40" />
          </>
        )}
      </div>

      <div 
        className={cn(
          "px-4 py-2 rounded-lg border-2 transition-all duration-300",
          isActive 
            ? "bg-card border-zinc-400/60 ring-2 ring-zinc-400/20" 
            : "bg-secondary/80 border-zinc-500/40"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <div className="flex items-center gap-1">
            {isDealer && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                D
              </span>
            )}
            {isBigBlind && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                BB
              </span>
            )}
            {isSmallBlind && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">
                SB
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-mono text-xs text-muted-foreground">
            {chips.toLocaleString()}
          </span>
        </div>
      </div>

      {bet !== undefined && bet > 0 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-muted border border-zinc-500/40 rounded text-xs font-mono text-muted-foreground">
          {bet.toLocaleString()}
        </div>
      )}
    </div>
  );
}
