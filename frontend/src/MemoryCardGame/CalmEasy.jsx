import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import background from "../assets/images/calm-bg.jpg";
import bgMusic from "../assets/audio/calm-audio.mp3";
import axios from "axios";




const defaultDifficulty = "Easy";

// Card Images
const cardImages = [
    { id: 1, image: "/images/SpaceShip.jpg" },
    { id: 2, image: "/images/SpaceShip.jpg" },
    { id: 3, image: "/images/Meteor.jpg" },
    { id: 4, image: "/images/Meteor.jpg" },
  ];

// Audio files for matching and final congratulation
const matchAudioFiles = [
  "/audio/wonderful.mp3",

];

const congratsAudio = "/audio/congrats.mp3"; // Final congratulations audio

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
const saveGameData = async (gameData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/memory/save", gameData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Game data saved successfully", response.data);
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message);
  }
};

// Styled Components
const StyledGameContainer = styled(Box)(({ theme, mouseDisabled }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  pointerEvents: mouseDisabled ? "none" : "auto", 

}));

const PixelButton = styled(Box)(({ theme }) => ({
    display: "inline-block",
    backgroundColor: "rgba(44, 44, 84, 0.8)", // Softer background color
    color: "#ffffff",
    fontFamily: '"Press Start 2P", cursive',
    fontSize: "14px",
    padding: "15px 30px",
    border: "2px solid transparent", // Transparent border to enable gradient
    borderRadius: "12px", // Slightly more rounded
    backgroundImage: "linear-gradient(to right, #7a77b9, #4e4a84)", // Gradient effect
    boxShadow: "0 0 12px rgba(122, 119, 185, 0.6)", // Softer glow effect
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease-in-out",
  
    "&:hover": {
      backgroundImage: "linear-gradient(to right, #6d6ab3, #464280)", // Slightly darker on hover
      boxShadow: "0 0 18px rgba(122, 119, 185, 0.9)", // Stronger glow
      transform: "scale(1.05)", // Slight growth effect
    },
  
    "&:active": {
      transform: "scale(0.95)", // Press-down effect
      boxShadow: "0 0 8px rgba(122, 119, 185, 0.4)", // Softer glow when pressed
    },
  }));

  const PixelBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: "15%",
    left: "1%",
    background: "linear-gradient(to right, #5b6477, #3a4052)", // Smooth gradient
    color: "#ffffff",
    padding: "12px 10px", // Slightly larger padding
    border: "2px solid rgba(145, 158, 171, 0.8)", // Softer border
    borderRadius: "12px", // More rounded corners
    boxShadow: "0 0 12px rgba(91, 100, 119, 0.6)", // Gentle glow effect
    fontFamily: '"Press Start 2P", cursive',
    fontSize: "13px",
    textAlign: "center",
    opacity: 0.9, // Slight transparency for blending effect
    transition: "all 0.3s ease-in-out",
  
    "&:hover": {
      boxShadow: "0 0 18px rgba(91, 100, 119, 0.8)", // Enhanced glow on hover
    },
  }));

const PixelTimerBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: "5%",
    left: "1%",
    background: "linear-gradient(to right, #4e5673, #2c3142)", // Calming blue gradient
    color: "#ffffff",
    padding: "12px 24px",
    border: "2px solid rgba(145, 158, 171, 0.8)", // Softer border
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(78, 86, 115, 0.6)", // Gentle glow effect
    fontFamily: '"Press Start 2P", cursive',
    fontSize: "13px",
    textAlign: "center",
    opacity: 0.9, // Slight transparency for blending effect
    transition: "all 0.3s ease-in-out",
  
    "&:hover": {
      boxShadow: "0 0 18px rgba(78, 86, 115, 0.8)", // Enhanced glow on hover
    },
  }));

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "220px",
  height: "220px",
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#1b1f34",
  border: "2px solid #4c5c77",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#2c2c54',  // Matching the game's background color
  border: '2px solid #00d9ff', // Matching the pixel border
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Subtle shadow for pixel look
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px', // Pixel rounded corners
};

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive', // Pixelated font style
  fontSize: '24px',
  color: '#fff',  // White text to stand out on the background
  letterSpacing: '1px',
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,  // Pixelated text shadow
}));

const PixelButtonModal = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive', // Pixelated font style
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Card Component
const Card = ({ card, handleClick, flipped, matched }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform }}>
        <CardFront>
          <img src={card.image} alt="Card front" style={{ width: "80%", height: "80%" }} />
        </CardFront>
        <CardBack>
          <img src="/images/calm-cover.jpg" alt="Card back" style={{ width: "80%", height: "80%" }} />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

const  CalmEasy = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0);
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);



  const handleSaveNewGame = () => {
    saveGameData({
        userID,
        gameDate: new Date(),
        failed: failedAttempts,
        difficulty: defaultDifficulty,
        completed: 0,
        timeTaken: timer,
    });
};
  
  const handleNewGame = () => {
   
    
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0); // Reset audio index

    
    const mouseDisableDuration = 2000;
    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);  // Re-enable mouse events after mouseDisableDuration
    }, mouseDisableDuration);

  
    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
   
    }, 1500);
  };
  const handleBackButton = () => {
    setOpenModal(true); // Show the confirmation modal
  };

  const handleModalYes = () => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted"); // Remove game completion flag
    navigate("/play"); // Navigate to play
  };

  const handleModalNo = () => {
    setOpenModal(false); // Close the modal and resume game
  };
  
 
  useEffect(() => {
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current.play().catch((error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev) => [...prev, card1.id, card2.id]);
          if (audioIndex < matchAudioFiles.length) {
            // Play the next audio in order
            const nextAudio = new Audio(matchAudioFiles[audioIndex]);
            nextAudio.volume = sfxVolume / 100; // Set the volume for sound effects
            nextAudio.play();
            setAudioIndex(audioIndex + 1); // Move to the next audio
          }
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, audioIndex, sfxVolume]);

  
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
        // Play the congratulations audio
        const congrats = new Audio(congratsAudio);
        congrats.volume = sfxVolume / 100;
        congrats.play();

        // Stop the timer before saving the game data
        setTimerActive(false);

        // Ensure the game data is saved only once
        const saveData = async () => {
            try {
                await saveGameData({
                    userID,
                    gameDate: new Date(),
                    failed: failedAttempts,
                    difficulty: defaultDifficulty,
                    completed: 1,  
                    timeTaken: timer,
                });
                localStorage.setItem("gameCompleted", "true");
                setTimeout(() => navigate("/calm-congt-easy"), 1000);
            } catch (error) {
                console.error("Error saving game data:", error);
            }
        };

        saveData();
    }
}, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer]);


  const userID = localStorage.getItem("userID"); // ✅ Fetch from local storage or auth context
  if (!userID) {
    console.error("Error: userID is missing.");
    return;
  }

  const handleCardClick = (card) => {
    if (!matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton onClick={handleBackButton} sx={{ alignSelf: "flex-start", margin: 2 }}>
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600 }}>
  {cards.map((card) => (
    <Grid item xs={6} key={card.id}> {/* Changed from xs={3} to xs={6} for 2 cards per row */}
      <Card
        card={card}
        handleClick={() => handleCardClick(card)}
        flipped={
          initialReveal ||
          flippedCards.some((c) => c.id === card.id) ||
          matchedCards.includes(card.id)
        }
        matched={matchedCards.includes(card.id)}
      />
    </Grid>
  ))}
</Grid>
      <Box sx={{ mt: 2, textAlign: "center" }}>
     
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }} sx={{ mt: 4 }}>
          New Game
        </PixelButton>
      </Box>


      <Modal open={openModal} onClose={handleModalNo}>
  <Box sx={modalStyle}>
    <PixelTypography variant="h6">
      Are you sure you want to go back to the play page?
    </PixelTypography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
      <PixelButtonModal onClick={() => { handleSaveNewGame(); handleModalYes(); }} variant="contained" color="primary">
        Yes
      </PixelButtonModal>
      <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
        No
      </PixelButtonModal>
    </Box>
  </Box>
</Modal>
    </StyledGameContainer>
  );
};



export default CalmEasy;
