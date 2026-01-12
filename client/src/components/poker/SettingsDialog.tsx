import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  isDark,
  onThemeChange,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-zinc-500/40">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Appearance
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-zinc-500/30">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="theme-toggle" className="text-sm font-medium">
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isDark ? "Switch to light appearance" : "Switch to dark appearance"}
                  </p>
                </div>
              </div>
              <Switch
                id="theme-toggle"
                checked={!isDark}
                onCheckedChange={(checked) => onThemeChange(!checked)}
                data-testid="switch-theme"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Audio
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-zinc-500/30">
              <div>
                <Label htmlFor="sound-toggle" className="text-sm font-medium">
                  Sound Effects
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Play sounds for game actions
                </p>
              </div>
              <Switch
                id="sound-toggle"
                defaultChecked={true}
                data-testid="switch-sound"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
