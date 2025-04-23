import { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { FaSpinner, FaTimes, FaCopy, FaExclamationTriangle } from "react-icons/fa";

export default function SentimentDashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState("roberta");
  const [preprocess, setPreprocess] = useState(false);

  const sampleTweets = [
    {
      text: "I love this product! It works perfectly and the customer service is amazing! 😍",
      label: "positive"
    },
    {
      text: "The event was okay. Nothing special but not bad either.",
      label: "neutral"
    },
    {
      text: "Terrible experience. The app crashes constantly and support never replies. Avoid!",
      label: "negative"
    }
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        text,
        model,
        preprocess,
      });

      if (response.data && response.data.length > 0) {
        setResult(response.data[0]);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error analyzing sentiment:", err);
      setError("Failed to analyze sentiment. Please check the server or input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResults = () => {
    const resultText = `Sentiment: ${result.label}\nConfidence: ${(result.score * 100).toFixed(2)}%\nPositive: ${result.positive.toFixed(2)}% | Neutral: ${result.neutral.toFixed(2)}% | Negative: ${result.negative.toFixed(2)}%`;
    navigator.clipboard.writeText(resultText);
    alert("Results copied to clipboard!");
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-500";
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "negative":
        return "bg-red-100 text-red-800 border-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const chartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [result?.positive || 0, result?.neutral || 0, result?.negative || 0],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-start gap-6">
      <h1 className="text-3xl font-bold mt-4">Sentiment Analysis Dashboard</h1>

      <div className="w-full max-w-xl p-4 bg-white rounded-lg shadow-md">
        <div className="relative">
          <textarea
            placeholder="Enter a tweet or post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-4 p-2 border rounded w-full h-24 resize-none"
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              title="Clear text"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Try a sample tweet:</label>
          <select
            onChange={(e) => setText(sampleTweets[e.target.value].text)}
            className="p-2 border rounded w-full mb-4"
          >
            <option value="">Select a sample...</option>
            {sampleTweets.map((tweet, index) => (
              <option key={index} value={index}>
                {tweet.label} - {tweet.text.substring(0, 30)}...
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <select
            className="p-2 border rounded"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="roberta">roBERTa (CardiffNLP)</option>
            <option value="vader">VADER</option>
          </select>

          <label className="text-sm flex items-center">
            <input
              type="checkbox"
              checked={preprocess}
              onChange={(e) => setPreprocess(e.target.checked)}
              className="mr-2"
            />
            Preprocess Text (Remove Stopwords)
          </label>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-xl p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
          <FaExclamationTriangle />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white shadow-md rounded-2xl p-6 text-center w-full max-w-lg relative">
          <button
            onClick={handleCopyResults}
            className="absolute top-4 right-4 p-1 text-gray-500 hover:text-blue-500"
            title="Copy results"
          >
            <FaCopy />
          </button>
          <p className={`text-xl font-semibold capitalize px-3 py-1 rounded-full border-l-4 ${getSentimentColor(result.label)}`}>
            Sentiment: {result.label}
          </p>
          <p className="text-sm text-gray-500">Confidence: {(result.score * 100).toFixed(2)}%</p>
          <div className="mt-4">
            <Pie data={chartData} />
          </div>
          <p className="mt-4 text-sm">
            Positive: {result.positive.toFixed(2)}% | Neutral: {result.neutral.toFixed(2)}% | Negative: {result.negative.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}