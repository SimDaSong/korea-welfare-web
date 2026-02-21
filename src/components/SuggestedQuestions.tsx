import { Button } from '@/components/ui/button';

interface SuggestedQuestionsProps {
  suggestions: readonly string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ suggestions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((q) => (
        <Button
          key={q}
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onSelect(q)}
        >
          {q}
        </Button>
      ))}
    </div>
  );
}
