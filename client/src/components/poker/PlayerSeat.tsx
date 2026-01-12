import { cn } from "@/lib/utils";
import { PlayingCard } from "./PlayingCard";

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
  isFolded?: boolean;
  bet?: number;
  position: "top" | "top-left" | "top-right" | "left" | "right" | "bottom-left" | "bottom-right" | "bottom";
  showCards?: boolean;
  className?: string;
}

const positionClasses: Record<string, string> = {
  "top": "top-0 left-1/2 -translate-x-1/2",
  "top-left": "top-4 left-8",
  "top-right": "top-4 right-8",
  "left": "top-1/2 left-0 -translate-y-1/2",
  "right": "top-1/2 right-0 -translate-y-1/2",
  "bottom-left": "bottom-4 left-8",
  "bottom-right": "bottom-4 right-8",
  "bottom": "bottom-0 left-1/2 -translate-x-1/2",
};

export function PlayerSeat({
  name,
  chips,
  cards,
  isActive = false,
  isDealer = false,
  isFolded = false,
  bet,
  position,
  showCards = false,
  className,
}: PlayerSeatProps) {
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
        {cards?.map((card, i) => (
          <PlayingCard
            key={i}
            suit={showCards ? card.suit : undefined}
            rank={showCards ? card.rank : undefined}
            faceDown={!showCards}
            size="sm"
          />
        )) ?? (
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
          {isDealer && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              D
            </span>
          )}
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
