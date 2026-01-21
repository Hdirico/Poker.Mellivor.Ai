import { useState, useEffect } from "react";
import { Header } from "@/components/poker/Header";
import { PokerTable } from "@/components/poker/PokerTable";
import { ActionBar } from "@/components/poker/ActionBar";
import { usePokerGame } from "@/hooks/use-poker-game";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [dealKey, setDealKey] = useState(0);

  const {
    tableId,
    status,
    pot,
    players,
    communityCards,
    smallBlind,
    bigBlind,
    isLoading,
    error,
    createTable,
    dealHand,
    fold,
    check,
    call,
    raise,
    canCheck,
    callAmount,
    isMyTurn,
    humanPlayer,
  } = usePokerGame();

  useEffect(() => {
    if (!tableId) {
      createTable().catch(console.error);
    }
  }, [tableId, createTable]);

  const handleDeal = async () => {
    setDealKey(prev => prev + 1);
    try {
      await dealHand();
    } catch (err) {
      console.error("Deal error:", err);
    }
  };

  const handleFold = async () => {
    if (!isMyTurn) return;
    try {
      await fold();
    } catch (err) {
      console.error("Fold error:", err);
    }
  };

  const handleCheck = async () => {
    if (!isMyTurn) return;
    try {
      await check();
    } catch (err) {
      console.error("Check error:", err);
    }
  };

  const handleCall = async () => {
    if (!isMyTurn) return;
    try {
      await call();
    } catch (err) {
      console.error("Call error:", err);
    }
  };

  const handleRaise = async (amount: number) => {
    if (!isMyTurn) return;
    try {
      await raise(amount);
    } catch (err) {
      console.error("Raise error:", err);
    }
  };

  const blindsDisplay = `${smallBlind}/${bigBlind}`;

  return (
    <div className="min-h-screen flex flex-col bg-background" data-testid="page-home">
      <Header 
        tableName="Main Table #1" 
        blinds={blindsDisplay}
        isDark={isDark}
        onThemeChange={setIsDark}
        onDeal={handleDeal}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 text-center text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-background border rounded-lg px-6 py-3 shadow-lg">
            <span className="text-muted-foreground">Processing...</span>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-8 relative">
        <PokerTable
          key={dealKey}
          players={players}
          communityCards={communityCards}
          pot={pot}
          isDark={isDark}
        />
        
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick={handleDeal}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              data-testid="button-start-game"
            >
              Start Game
            </button>
          </div>
        )}
      </main>

      <ActionBar
        minBet={bigBlind * 2}
        maxBet={humanPlayer?.chips || 1000}
        currentBet={Math.max(...players.map(p => p.bet), 0)}
        playerChips={humanPlayer?.chips || 1000}
        onFold={handleFold}
        onCheck={handleCheck}
        onCall={handleCall}
        onRaise={handleRaise}
        canCheck={canCheck || false}
        callAmount={callAmount}
        disabled={!isMyTurn || isLoading}
      />
    </div>
  );
}
