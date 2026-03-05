import { useNavigate } from 'react-router-dom';

function AskDoctorCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ask-doctor');
  };

  return (
    <div className="ask-doctor-card" onClick={handleClick}>
      <div className="ask-doctor-card__content">
        <div className="ask-doctor-card__icon">
          {/* Stethoscope Icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>
        <div className="ask-doctor-card__text">
          <h3 className="ask-doctor-card__title">Got a health concern? Ask right away.</h3>
          <p className="ask-doctor-card__description">
            Receive expert replies through blog posts, phone calls, or email.
          </p>
        </div>
        <div className="ask-doctor-card__arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <style>{`
                .ask-doctor-card {
                    margin-top: 40px;
                    height: 85px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 0 24px;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.3s ease;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .ask-doctor-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }

                .ask-doctor-card:active {
                    transform: translateY(0);
                }

                .ask-doctor-card__content {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .ask-doctor-card__icon {
                    flex-shrink: 0;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    backdrop-filter: blur(10px);
                }

                .ask-doctor-card__text {
                    flex: 1;
                    min-width: 0;
                }

                .ask-doctor-card__title {
                    color: white;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.01em;
                }

                .ask-doctor-card__description {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 13px;
                    margin: 0;
                    line-height: 1.4;
                }

                .ask-doctor-card__arrow {
                    flex-shrink: 0;
                    color: white;
                    opacity: 0.8;
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }

                .ask-doctor-card:hover .ask-doctor-card__arrow {
                    transform: translateX(4px);
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    .ask-doctor-card {
                        padding: 0 16px;
                    }

                    .ask-doctor-card__content {
                        gap: 12px;
                    }

                    .ask-doctor-card__icon {
                        width: 48px;
                        height: 48px;
                    }

                    .ask-doctor-card__icon svg {
                        width: 24px;
                        height: 24px;
                    }

                    .ask-doctor-card__title {
                        font-size: 16px;
                    }

                    .ask-doctor-card__description {
                        font-size: 12px;
                    }

                    .ask-doctor-card__arrow {
                        display: none;
                    }
                }
            `}</style>
    </div>
  );
}

export default AskDoctorCard;
