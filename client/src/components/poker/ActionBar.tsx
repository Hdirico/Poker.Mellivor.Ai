import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const betAmounts = [25, 50, 100, 500].filter(v => v <= maxBet);

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
                  variant={raiseAmount === amount ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setRaiseAmount(amount)}
                  className={cn(
                    "px-4 font-mono text-sm",
                    raiseAmount === amount && "ring-2 ring-primary/50"
                  )}
                  data-testid={`button-bet-${amount}`}
                >
                  {amount}
                </Button>
              ))}
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
