'use client';

interface Stage2Props {
  onComplete: () => void;
}

const Stage2 = ({ onComplete }: Stage2Props) => {
  return (
    <div className="card-body">
      <h5 className="card-title mb-3">Stage 2: Debug Code by Clicking</h5>
      <p className="card-text mb-4">
        This stage will be implemented next. Click the button to proceed for now.
      </p>
      
      <div className="d-flex gap-2 flex-wrap">
        <button 
          className="btn btn-success"
          onClick={onComplete}
          style={{
            color: "white",
            backgroundColor: "#28a745",
            borderColor: "#28a745"
          }}
        >
          Next Stage (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default Stage2;
