/* eslint-disable no-unused-vars */
export default function DownloadShare({ result }) {
    const downloadJSON = () => {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sentiment-analysis-result.json";
      link.click();
    };
  
    const shareText = async () => {
      const text = `Sentiment Analysis Result:\nInput: ${result.text}\nRoBERTa: ${result.roberta.label} (${(result.roberta.score * 100).toFixed(1)}%)\nVADER: ${result.vader.label} (Compound: ${result.vader.compound})`;
      try {
        await navigator.share({ title: "Sentiment Analysis", text });
      } catch (error) {
        alert("Sharing failed or not supported");
      }
    };
  
    return (
      <div className="flex gap-4 mt-4">
        <button
          onClick={downloadJSON}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download JSON
        </button>
  
        <button
          onClick={shareText}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Share Result
        </button>
      </div>
    );
  }
  