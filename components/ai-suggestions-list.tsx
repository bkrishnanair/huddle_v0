"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Suggestion {
  title: string;
  description: string;
}

interface AISuggestionsListProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
}

const AISuggestionsList: React.FC<AISuggestionsListProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="glass-card border-white/30 cursor-pointer hover:bg-white/20"
          onClick={() => onSelect(suggestion)}
        >
          <CardContent className="p-4">
            <p className="font-semibold text-white">{suggestion.title}</p>
            <p className="text-sm text-white/80">{suggestion.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AISuggestionsList;
