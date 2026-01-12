import { cn } from "@/lib/utils";
import { Settings, HelpCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { SettingsDialog } from "./SettingsDialog";
import logoDark from "@assets/Screenshot_2026-01-12_at_3.38.57_PM_1768252434541.png";

interface HeaderProps {
  tableName: string;
  blinds: string;
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
  className?: string;
}

export function Header({ tableName, blinds, isDark, onThemeChange, className }: HeaderProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [isDark]);

  return (
    <header 
      className={cn(
        "flex items-center justify-between px-6 py-3 border-b-2 border-zinc-500/40 bg-card/50 backdrop-blur-sm",
        className
      )}
      data-testid="header"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {isDark ? (
            <img src={logoDark} alt="Mellipoker.Ai" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary border border-zinc-400/30 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
          )}
          <span className="font-semibold tracking-tight">Mellipoker.Ai</span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">{tableName}</span>
          <span className="text-xs text-muted-foreground font-mono px-2 py-0.5 bg-muted rounded">
            {blinds}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-mute"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-help"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        isDark={isDark}
        onThemeChange={onThemeChange}
      />
    </header>
  );
}
