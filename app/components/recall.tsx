type RecallProps = {
    onRecall: () => void;
  };
  
  const Recall = ({ onRecall }: RecallProps) => {
    return (
      <button
        onClick={onRecall}
        className="m-4 ml-0 p-5 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
      >
        Recall
      </button>
    );
  };
  
  export default Recall;
  