import { useContext } from 'react';

import { ChallengesContext } from '../store/challenges-context.jsx';
import {AnimatePresence, motion} from 'framer-motion';


export default function ChallengeItem({
  challenge,
  onViewDetails,
  isExpanded,
}) {
  const { updateChallengeStatus } = useContext(ChallengesContext);

  const formattedDate = new Date(challenge.deadline).toLocaleDateString(
    'ko-KR',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  function handleCancel() {
    updateChallengeStatus(challenge.id, 'failed');
  }

  function handleComplete() {
    updateChallengeStatus(challenge.id, 'completed');
  }

  return (
    <motion.li layout  exit={{y:-30, opacity:0}}>
      <article className="challenge-item">
        <header>
          <img {...challenge.image} />
          <div className="challenge-item-meta">
            <h2>{challenge.title}</h2>
            <p>완료 기한: {formattedDate}</p>
            <p className="challenge-item-actions">
              <button onClick={handleCancel} className="btn-negative">
              실패로 표시
              </button>
              <button onClick={handleComplete}>완료로 표시</button>
            </p>
          </div>
        </header>
        <div className={`challenge-item-details ${isExpanded ? 'expanded' : ''}` }>
          <p>
            <button onClick={onViewDetails}>
              세부 정보보기{' '}
              <motion.span 
                animate={{rotate:isExpanded ? 180: 0}}
                className="challenge-item-details-icon"
              >&#9650;😊😊</motion.span>

            </button>
          </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
                initial={{height:0, opacity:0}} 
                animate={{height:'auto' , opacity:1}} 
                exit={{height:0, opacity:0}} 
              >
              <p className="challenge-item-description">
                {challenge.description}
              </p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </article>
    </motion.li>
  );
}
