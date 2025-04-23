export default function HistoryLog({ history }) {
    return (
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-2">Analysis History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No previous analysis yet.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry, idx) => (
              <li key={idx} className="border rounded p-2">
                <p className="font-semibold">Input: {entry.text}</p>
                <p className="text-sm text-gray-700">RoBERTa: {entry.roberta.label} ({(entry.roberta.score * 100).toFixed(1)}%)</p>
                <p className="text-sm text-gray-700">VADER: {entry.vader.label} (Compound: {entry.vader.compound})</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  