import { cn } from "@/lib/utils";
import { PlayerSeat } from "./PlayerSeat";
import { CommunityCards } from "./CommunityCards";
import tableFeltDark from "@assets/Screenshot_2026-01-12_at_3.38.57_PM_1768250366126.png";
import tableFeltLight from "@assets/Screenshot_2026-01-12_at_3.57.38_PM_1768251477490.png";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface Player {
  id: string;
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
}

interface PokerTableProps {
  players: Player[];
  communityCards: Card[];
  pot: number;
  isDark?: boolean;
  className?: string;
}

const dealOrderByPosition: Record<string, number> = {
  "right": 0,
  "bottom": 1,
  "left": 2,
  "top-left": 3,
  "top-right": 4,
  "top": 5,
  "bottom-left": 6,
  "bottom-right": 7,
};

export function PokerTable({ 
  players, 
  communityCards, 
  pot,
  isDark = true,
  className 
}: PokerTableProps) {
  return (
    <div 
      className={cn(
        "relative w-full max-w-4xl aspect-[16/10] mx-auto",
        className
      )}
      data-testid="poker-table"
    >
      <div className={cn(
        "absolute inset-12 rounded-[100px] border-2 border-zinc-500/40 overflow-hidden",
        isDark ? "bg-zinc-900" : "bg-white"
      )}>
        <div 
          className={cn(
            "absolute inset-4 rounded-[80px] border border-zinc-500/25 overflow-hidden",
            isDark ? "bg-zinc-900" : "bg-white"
          )}
          style={{
            backgroundImage: `url(${isDark ? tableFeltDark : tableFeltLight})`,
            backgroundSize: isDark ? 'cover' : 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={cn(
            "absolute inset-0",
            isDark ? "bg-black/30" : "bg-white/10"
          )} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pt-4">
        <CommunityCards 
          cards={communityCards} 
          baseDelay={players.length * 2 * 0.15 + 0.3}
        />
        
        <div className="px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border-2 border-zinc-500/40">
          <span className="text-xs text-muted-foreground">Pot</span>
          <span className="ml-2 font-mono text-lg text-foreground">
            {pot.toLocaleString()}
          </span>
        </div>
      </div>

      {players.map((player) => (
        <PlayerSeat
          key={player.id}
          {...player}
          isDark={isDark}
          dealOrder={dealOrderByPosition[player.position] ?? 0}
          dealerPosition="top-right"
        />
      ))}
    </div>
  );
}
