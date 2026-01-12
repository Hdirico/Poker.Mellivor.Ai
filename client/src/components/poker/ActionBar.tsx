import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

  const quickBetAmounts = [
    { label: "½ Pot", value: Math.floor(currentBet * 0.5) },
    { label: "Pot", value: currentBet },
    { label: "2× Pot", value: currentBet * 2 },
  ].filter(b => b.value <= maxBet && b.value >= minBet);

  return (
    <div 
      className={cn(
        "bg-card/95 backdrop-blur-sm border-t border-border p-4",
        className
      )}
      data-testid="action-bar"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onFold}
              className="px-6 text-muted-foreground hover:text-foreground hover:border-destructive/50"
              data-testid="button-fold"
            >
              Fold
            </Button>

            {canCheck ? (
              <Button
                variant="outline"
                size="lg"
                onClick={onCheck}
                className="px-6"
                data-testid="button-check"
              >
                Check
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={onCall}
                className="px-6"
                data-testid="button-call"
              >
                Call
                <span className="ml-2 font-mono text-muted-foreground">
                  {callAmount.toLocaleString()}
                </span>
              </Button>
            )}
          </div>

          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 px-4">
              <Slider
                value={[raiseAmount]}
                onValueChange={([val]) => setRaiseAmount(val)}
                min={minBet}
                max={maxBet}
                step={Math.max(1, Math.floor(minBet / 10))}
                className="w-full"
                data-testid="slider-raise"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground font-mono">
                <span>{minBet.toLocaleString()}</span>
                <span>{maxBet.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {quickBetAmounts.map((bet) => (
                <Button
                  key={bet.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRaiseAmount(bet.value)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  data-testid={`button-quick-${bet.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {bet.label}
                </Button>
              ))}
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={() => onRaise(raiseAmount)}
              className="px-6 min-w-[120px]"
              data-testid="button-raise"
            >
              Raise
              <span className="ml-2 font-mono">
                {raiseAmount.toLocaleString()}
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
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
