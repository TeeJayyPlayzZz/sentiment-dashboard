import { Card, CardContent } from "@/components/ui/card";

export default function ComparisonCard({ roberta, vader }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-blue-100">
        <CardContent>
          <h3 className="text-lg font-semibold text-blue-800">RoBERTa Model</h3>
          <p className="text-blue-700">Sentiment: {roberta.label}</p>
          <p className="text-blue-600 text-sm">Confidence: {(roberta.score * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>

      <Card className="bg-green-100">
        <CardContent>
          <h3 className="text-lg font-semibold text-green-800">VADER Model</h3>
          <p className="text-green-700">Sentiment: {vader.label}</p>
          <p className="text-green-600 text-sm">Compound Score: {vader.compound}</p>
        </CardContent>
      </Card>
    </div>
  );
}
