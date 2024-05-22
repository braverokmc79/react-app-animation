import { useState } from 'react';

import NewChallenge from './NewChallenge.jsx';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';


export default function Header() {
  const [isCreatingNewChallenge, setIsCreatingNewChallenge] = useState();

  function handleStartAddNewChallenge() {
    setIsCreatingNewChallenge(true);
  }

  function handleDone() {
    setIsCreatingNewChallenge(false);
  }

  return (
    <>
     <AnimatePresence>
        {isCreatingNewChallenge && <NewChallenge onDone={handleDone} />}
      </AnimatePresence>

      <header id="main-header">
        <h1><Link to={"/"} > 도전</Link></h1>
        <motion.button
          whileHover={{scale:1.1}}
          transition={{type:'spring', stiffness:500 , mass: 1 }}
          onClick={handleStartAddNewChallenge} 
          className="button">
         추가 도전
        </motion.button>
      </header>
  
   </>
  
  );

}
