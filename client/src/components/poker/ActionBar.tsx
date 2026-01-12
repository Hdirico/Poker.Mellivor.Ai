import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ActionBarProps {
  minBet: number;
  maxBet: number;
  currentBet: number;
  playerChips: number;
  onFold: () => void;
  onCheck: () => void;
  onCall: () => void;
  onRaise: (amount: number) => void;
  canCheck: boolean;
  callAmount: number;
  className?: string;
}

export function ActionBar({
  minBet,
  maxBet,
  currentBet,
  playerChips,
  onFold,
  onCheck,
  onCall,
  onRaise,
  canCheck,
  callAmount,
  className,
}: ActionBarProps) {
  const [raiseAmount, setRaiseAmount] = useState(minBet);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const betAmounts = [25, 50, 100, 500].filter(v => v <= maxBet);

  const handleCustomSubmit = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount >= minBet && amount <= maxBet) {
      setRaiseAmount(amount);
      setShowCustomInput(false);
      setCustomAmount("");
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomSubmit();
    } else if (e.key === "Escape") {
      setShowCustomInput(false);
      setCustomAmount("");
    }
  };

  return (
    <div 
      className={cn(
        "bg-card/95 backdrop-blur-sm border-t-2 border-zinc-500/40 px-6 py-5",
        className
      )}
      data-testid="action-bar"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={onFold}
              className="px-8 text-muted-foreground hover:text-foreground hover:border-destructive/50"
              data-testid="button-fold"
            >
              Fold
            </Button>

            {canCheck ? (
              <Button
                variant="outline"
                size="lg"
                onClick={onCheck}
                className="px-8"
                data-testid="button-check"
              >
                Check
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={onCall}
                className="px-8"
                data-testid="button-call"
              >
                Call
                <span className="ml-2 font-mono text-muted-foreground">
                  {callAmount.toLocaleString()}
                </span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {betAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setRaiseAmount(prev => Math.min(prev + amount, maxBet))}
                  className="px-4 font-mono text-sm"
                  data-testid={`button-bet-${amount}`}
                >
                  +{amount}
                </Button>
              ))}
              
              {showCustomInput ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                    placeholder={minBet.toString()}
                    className="w-24 h-8 text-sm font-mono"
                    autoFocus
                    data-testid="input-custom-bet"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCustomSubmit}
                    className="text-xs px-2"
                    data-testid="button-custom-confirm"
                  >
                    Set
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomAmount("");
                    }}
                    className="h-8 w-8 text-muted-foreground"
                    data-testid="button-custom-cancel"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomInput(true)}
                  className="px-4 text-sm"
                  data-testid="button-custom"
                >
                  Custom
                </Button>
              )}
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={() => onRaise(raiseAmount)}
              className="px-8 min-w-[140px]"
              data-testid="button-raise"
            >
              Raise
              <span className="ml-2 font-mono">
                {raiseAmount.toLocaleString()}
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <span>
            Pot: <span className="font-mono text-foreground">{currentBet.toLocaleString()}</span>
          </span>
          <span>
            Your chips: <span className="font-mono text-foreground">{playerChips.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
