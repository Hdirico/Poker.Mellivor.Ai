import { cn } from "@/lib/utils";
import { PlayingCard } from "./PlayingCard";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface CommunityCardsProps {
  cards: Card[];
  className?: string;
}

export function CommunityCards({ cards, className }: CommunityCardsProps) {
  const emptySlots = 5 - cards.length;

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      data-testid="community-cards"
    >
      {cards.map((card, i) => (
        <PlayingCard
          key={i}
          suit={card.suit}
          rank={card.rank}
          size="lg"
        />
      ))}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div 
          key={`empty-${i}`}
          className="w-20 h-28 rounded-lg border border-dashed border-border/30"
        />
      ))}
    </div>
  );
}
