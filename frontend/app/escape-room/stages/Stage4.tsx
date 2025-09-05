'use client';

interface Stage4Props {
  onComplete: () => void;
}

const Stage4 = ({ onComplete }: Stage4Props) => {
  return (
    <div className="card-body">
      <h5 className="card-title mb-3">Stage 4: Data Porting</h5>
      <p className="card-text mb-4">
        This stage will be implemented next. Click the button to complete the escape room for now.
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
          Complete Escape Room (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default Stage4;
