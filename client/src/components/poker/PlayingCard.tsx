import { cn } from "@/lib/utils";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface PlayingCardProps {
  suit?: Suit;
  rank?: Rank;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const suitSymbols: Record<Suit, string> = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
};

const suitColors: Record<Suit, string> = {
  spade: "card-spade",
  heart: "card-heart",
  diamond: "card-diamond",
  club: "card-club",
};

const sizeClasses = {
  sm: "w-10 h-14 text-xs",
  md: "w-14 h-20 text-sm",
  lg: "w-20 h-28 text-base",
};

export function PlayingCard({ 
  suit = "spade", 
  rank = "A", 
  faceDown = false,
  size = "md",
  className 
}: PlayingCardProps) {
  if (faceDown) {
    return (
      <div 
        className={cn(
          "rounded-lg bg-secondary border border-border flex items-center justify-center",
          "transition-all duration-200",
          sizeClasses[size],
          className
        )}
        data-testid="card-facedown"
      >
        <div className="w-[70%] h-[80%] rounded bg-muted border border-border/50" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "rounded-lg bg-card border border-border relative",
        "transition-all duration-200 hover:border-muted-foreground/30",
        sizeClasses[size],
        suitColors[suit],
        className
      )}
      data-testid={`card-${rank}-${suit}`}
    >
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className="font-mono font-semibold">{rank}</span>
        <span className="text-[0.7em]">{suitSymbols[suit]}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl opacity-20">{suitSymbols[suit]}</span>
      </div>
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="font-mono font-semibold">{rank}</span>
        <span className="text-[0.7em]">{suitSymbols[suit]}</span>
      </div>
    </div>
  );
}
