import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CritiquePanelProps {
  content: string;
  persona: Record<string, any>;
  topic?: string;
}

export function CritiquePanel({ content, persona, topic }: CritiquePanelProps) {
  const [critique, setCritique] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCritique = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/critique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          persona,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate critique");
      }

      const data = await response.json();
      setCritique(data.critique);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={fetchCritique}
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        {isLoading ? "Generating Critique..." : "Get AI Critique"}
      </Button>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {critique && !error && (
        <Card className="p-6 space-y-4">
          {critique.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h3 key={i} className="text-lg font-semibold mt-4">
                  {line.replace("## ", "")}
                </h3>
              );
            }
            return line.trim() && <p key={i}>{line}</p>;
          })}
        </Card>
      )}
    </div>
  );
}
