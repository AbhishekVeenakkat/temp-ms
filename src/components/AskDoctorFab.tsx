import { useNavigate } from 'react-router-dom';

function AskDoctorFab() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ask-doctor');
  };

  return (
    <button
      className="ask-doctor-fab"
      onClick={handleClick}
      aria-label="Ask Doctor"
      title="Ask Doctor"
    >
      <div className="fab-content">
        {/* Stethoscope Icon */}
        <svg
          className="fab-icon"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stethoscope shape */}
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
        <span className="fab-label">Ask Doctor</span>
      </div>

      <style>{`
                .ask-doctor-fab {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: width 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
                    z-index: 1000;
                    overflow: hidden;
                    padding: 0;
                }

                .ask-doctor-fab:hover {
                    width: 170px;
                    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
                    transform: translateY(-2px);
                }

                .ask-doctor-fab:active {
                    transform: translateY(0);
                }

                .fab-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    white-space: nowrap;
                }

                .fab-icon {
                    flex-shrink: 0;
                    transition: margin 0.3s ease;
                }

                .ask-doctor-fab:hover .fab-icon {
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                }

                .fab-label {
                    font-weight: 600;
                    font-size: 0.95rem;
                    opacity: 0;
                    max-width: 0;
                    overflow: hidden;
                    transition: opacity 0.3s ease, max-width 0.3s ease;
                }

                .ask-doctor-fab:hover .fab-label {
                    opacity: 1;
                    max-width: 120px;
                    margin-right: 0.5rem;
                }

                @media (max-width: 768px) {
                    .ask-doctor-fab {
                        bottom: 1.5rem;
                        right: 1.5rem;
                        width: 56px;
                        height: 56px;
                    }

                    .ask-doctor-fab:hover {
                        width: 56px;
                        transform: scale(1.05);
                    }

                    .ask-doctor-fab:hover .fab-icon {
                        margin-left: 0;
                    }

                    .fab-label {
                        display: none;
                    }
                }
            `}</style>
    </button>
  );
}

export default AskDoctorFab;
