import { useState } from 'react';

import NewChallenge from './NewChallenge.jsx';

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
      {isCreatingNewChallenge && <NewChallenge onDone={handleDone} />}

      <header id="main-header">
        <h1>도전</h1>
        <button onClick={handleStartAddNewChallenge} className="button">
         추가 도전
        </button>
      </header>
    </>
  );
}
