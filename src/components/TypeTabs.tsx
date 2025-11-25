import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface TypeTabsProps {
  selected: string;
  onSelect: (type: string) => void;
  className?: string;
}

const TypeTabs: React.FC<TypeTabsProps> = ({ selected, onSelect, className }) => (
  <Tabs value={selected} onValueChange={onSelect} className={className}>
    <TabsList>
      {["Now", "Plan"].map((type) => (
        <TabsTrigger
          key={type}
          value={type}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${
            type === "Now" 
              ? "bg-success" 
              : "bg-primary"
          }`} />
          <span>{type}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export default TypeTabs; 