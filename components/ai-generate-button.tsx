"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 text-sm glass-card hover:glow text-white border-white/30"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span>Generate with AI ✨</span>
        </>
      )}
    </Button>
  );
};

export default AIGenerateButton;
