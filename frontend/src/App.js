import React, { useState, useEffect } from 'react';

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [catImage, setCatImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showMiddleButton, setShowMiddleButton] = useState(false);
  const [showPickMeButtons, setShowPickMeButtons] = useState(true);
  const [selected, setSelected] = useState(null);
  const [round, setRound] = useState(1);
  const [display_round, setDisplayRound] = useState(1);
  const [dogWins, setDogWins] = useState(0);
  const [catWins, setCatWins] = useState(0);

  useEffect(() => {
    const savedDogWins = localStorage.getItem('dogWins');
    const savedCatWins = localStorage.getItem('catWins');

    if (savedDogWins) {
      setDogWins(parseInt(savedDogWins, 10));
    }

    if (savedCatWins) {
      setCatWins(parseInt(savedCatWins, 10));
    }

    const fetchDogImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dog');
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch dog image');
        }
        if (data && data.message) {
          setDogImage(data.message);
        } else {
          throw new Error('Invalid data format for dog image');
        }
      } catch (error) {
        console.error('Error fetching dog image:', error);
        setError('Error fetching dog image');
      }
    };

    const fetchCatImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cat');
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch cat image');
        }
        if (data && data.url) {
          setCatImage(data.url);
        } else {
          throw new Error('Invalid data format for cat image');
        }
      } catch (error) {
        console.error('Error fetching cat image:', error);
        setError('Error fetching cat image');
      }
    };

    fetchDogImage();
    fetchCatImage();
  }, []);

  useEffect(() => {
    if (dogImage && catImage) {
      setLoading(false);
    }
  }, [dogImage, catImage]);

  const handlePickMe = (selected) => {
    setWinner(selected);
    setSelected(selected);
    setShowPickMeButtons(false);
    setShowMiddleButton(true);
    if (round < 11) {
      setRound(round + 1);
    }

    if (selected === 'dog' && display_round === 10) {
      setDogWins(prevWins => {
        const updatedDogWins = prevWins + 1;
        // Save updated wins to localStorage
        localStorage.setItem('dogWins', updatedDogWins);
        return updatedDogWins;
      });
    } else if (selected === 'cat' && display_round === 10) {
      setCatWins(prevWins => {
        const updatedCatWins = prevWins + 1;
        // Save updated wins to localStorage
        localStorage.setItem('catWins', updatedCatWins);
        return updatedCatWins;
      });
    }
  };

  const handleNextRound = () => {
    if (round === 11) {
      fetchCatImage();
      fetchDogImage();
      setWinner(null);
      setSelected(null);
      setShowPickMeButtons(true);
      setShowMiddleButton(false);
      setRound(1);
      setDisplayRound(1);
    } else {
      if (display_round < 11) {
        setDisplayRound(display_round + 1);
      }

      if (winner === 'dog') {
        fetchCatImage();
      } else if (winner === 'cat') {
        fetchDogImage();
      }

      setWinner(null);
      setSelected(null);
      setShowPickMeButtons(true);
      setShowMiddleButton(false);
    }
  };

  const fetchDogImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dog');
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      if (data && data.message) {
        setDogImage(data.message);
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
    }
  };

  const fetchCatImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cat');
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch cat image');
      }
      if (data && data.url) {
        setCatImage(data.url);
      }
    } catch (error) {
      console.error('Error fetching cat image:', error);
    }
  };

  return (
    <div className="App">
      <h1>Paws vs. Claws</h1>

      <div className="scoreboard">
        <p className="dog-wins">Dog Wins: {dogWins}</p>
        <p className="cat-wins">Cat Wins: {catWins}</p>
      </div>

      <div className="text-container">
        <p className={`winner-text ${winner === 'dog' ? 'show' : ''}`}>!WINNER!</p>
        <p className={`winner-text ${winner === 'cat' ? 'show' : ''}`}>!WINNER!</p>
      </div>

      <div className="images-container">
        <div className={`image-box ${selected === 'dog' ? 'yellow-box' : ''}`}>
          {dogImage && <img src={dogImage} alt="Dog" />}
        </div>
        <div className="text-between">
          {round < 11 ? (
            <>
              <p className="top-text">Round {display_round}</p>
              <p className="bottom-text">/ 10</p>
            </>
          ) : (
            <p className="top-text">{winner === 'dog' ? 'DOGS WIN' : 'CATS WIN'}</p>
          )}
        </div>
        <div className={`image-box ${selected === 'cat' ? 'yellow-box' : ''}`}>
          {catImage && <img src={catImage} alt="Cat" />}
        </div>
      </div>

      <div className={`buttons-container ${showMiddleButton ? 'middle-button-visible' : ''}`}>
        {showPickMeButtons && (
          <>
            <button onClick={() => handlePickMe('dog')}>Pick Me!</button>
            <button onClick={() => handlePickMe('cat')}>Pick Me!</button>
          </>
        )}
        {showMiddleButton && (
          <button className="middle-button show" onClick={handleNextRound}>
            {round === 11 ? 'Play Again!' : 'Move To Next Round'}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;