import { cn } from "@/lib/utils";
import { PlayingCard } from "./PlayingCard";
import { motion } from "framer-motion";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface CommunityCardsProps {
  cards: Card[];
  baseDelay?: number;
  className?: string;
}

export function CommunityCards({ cards, baseDelay = 0, className }: CommunityCardsProps) {
  const emptySlots = 5 - cards.length;

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      data-testid="community-cards"
    >
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -120, 
            rotate: -360,
            opacity: 0 
          }}
          animate={{ 
            y: 0, 
            rotate: 0,
            opacity: 1 
          }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 14,
            delay: baseDelay + (i * 0.15)
          }}
        >
          <PlayingCard
            suit={card.suit}
            rank={card.rank}
            size="lg"
          />
        </motion.div>
      ))}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div 
          key={`empty-${i}`}
          className="w-20 h-28 rounded-lg border-2 border-dashed border-zinc-500/30"
        />
      ))}
    </div>
  );
}
