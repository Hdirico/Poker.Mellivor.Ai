import { useState } from "react";
import { Header } from "@/components/poker/Header";
import { PokerTable } from "@/components/poker/PokerTable";
import { ActionBar } from "@/components/poker/ActionBar";

type Suit = "spade" | "heart" | "diamond" | "club";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

const mockPlayers = [
  {
    id: "1",
    name: "Sarah K.",
    chips: 2450,
    cards: [
      { suit: "spade" as Suit, rank: "A" as Rank },
      { suit: "heart" as Suit, rank: "K" as Rank },
    ],
    isActive: false,
    isDealer: false,
    isBigBlind: false,
    isSmallBlind: false,
    isFolded: false,
    bet: 100,
    position: "top-left" as const,
    showCards: false,
  },
  {
    id: "2",
    name: "Mike R.",
    chips: 1850,
    cards: [
      { suit: "club" as Suit, rank: "J" as Rank },
      { suit: "diamond" as Suit, rank: "Q" as Rank },
    ],
    isActive: false,
    isDealer: true,
    isBigBlind: false,
    isSmallBlind: false,
    isFolded: false,
    bet: 200,
    position: "top-right" as const,
    showCards: false,
  },
  {
    id: "3",
    name: "Alex T.",
    chips: 3200,
    cards: [
      { suit: "heart" as Suit, rank: "9" as Rank },
      { suit: "heart" as Suit, rank: "10" as Rank },
    ],
    isActive: false,
    isDealer: false,
    isBigBlind: false,
    isSmallBlind: true,
    isFolded: false,
    bet: 0,
    position: "right" as const,
    showCards: false,
  },
  {
    id: "4",
    name: "You",
    chips: 2800,
    cards: [
      { suit: "spade" as Suit, rank: "A" as Rank },
      { suit: "spade" as Suit, rank: "K" as Rank },
    ],
    isActive: true,
    isDealer: false,
    isBigBlind: true,
    isSmallBlind: false,
    isFolded: false,
    bet: 100,
    position: "bottom" as const,
    showCards: true,
  },
  {
    id: "5",
    name: "Jordan L.",
    chips: 1200,
    cards: [
      { suit: "diamond" as Suit, rank: "7" as Rank },
      { suit: "club" as Suit, rank: "8" as Rank },
    ],
    isActive: false,
    isDealer: false,
    isBigBlind: false,
    isSmallBlind: false,
    isFolded: false,
    bet: 100,
    position: "left" as const,
    showCards: false,
  },
];

const mockCommunityCards: Card[] = [
  { suit: "heart", rank: "A" },
  { suit: "club", rank: "7" },
  { suit: "spade", rank: "2" },
];

export default function Home() {
  const [pot] = useState(700);
  const [playerChips] = useState(2800);
  const [isDark, setIsDark] = useState(true);
  const [dealKey, setDealKey] = useState(0);

  const handleDeal = () => {
    setDealKey(prev => prev + 1);
  };

  const handleFold = () => {
    console.log("Fold");
  };

  const handleCheck = () => {
    console.log("Check");
  };

  const handleCall = () => {
    console.log("Call");
  };

  const handleRaise = (amount: number) => {
    console.log("Raise", amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" data-testid="page-home">
      <Header 
        tableName="Main Table #1" 
        blinds="50/100" 
        isDark={isDark}
        onThemeChange={setIsDark}
        onDeal={handleDeal}
      />

      <main className="flex-1 flex items-center justify-center p-8">
        <PokerTable
          key={dealKey}
          players={mockPlayers}
          communityCards={mockCommunityCards}
          pot={pot}
          isDark={isDark}
        />
      </main>

      <ActionBar
        minBet={200}
        maxBet={playerChips}
        currentBet={pot}
        playerChips={playerChips}
        onFold={handleFold}
        onCheck={handleCheck}
        onCall={handleCall}
        onRaise={handleRaise}
        canCheck={true}
        callAmount={100}
      />
    </div>
  );
}
