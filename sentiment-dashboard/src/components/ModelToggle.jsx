export default function ModelToggle({ showRoberta, showVader, setShowRoberta, setShowVader }) {
    return (
      <div className="flex gap-4 items-center mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showRoberta}
            onChange={() => setShowRoberta(!showRoberta)}
          />
          Show RoBERTa
        </label>
  
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showVader}
            onChange={() => setShowVader(!showVader)}
          />
          Show VADER
        </label>
      </div>
    );
  }
  