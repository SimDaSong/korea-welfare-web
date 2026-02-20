interface SuggestedQuestionsProps {
  suggestions: readonly string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ suggestions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
