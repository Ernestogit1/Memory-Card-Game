import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import background from "../assets/images/calm-bg-congt.jpg"; // Background image
import bgMusic from "../assets/audio/calm-congt.mp3"; // Background music file

// Styled Components
const PixelBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: '"Press Start 2P", cursive',
}));

const CongratulationsText = styled(Typography)(({ theme }) => ({
    fontSize: "100px",  // Increased font size for more prominence
    color: "#ff00ff",  // Neon Pink Color
    textAlign: "center",
    letterSpacing: "5px",
    textShadow: `
      -3px -3px 0px #ff00ff, 
      3px -3px 0px #00ffff,
      3px 3px 0px #ff00ff,
      -3px 3px 0px #00ffff
    `,
    animation: "neonGlow 2s ease-in-out infinite",
    "@keyframes neonGlow": {
      "0%": { textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff" },
      "100%": { textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #ff00ff" },
    },
  }));
  

  const SubText = styled(Typography)(({ theme }) => ({
    fontSize: "36px",
    color: "#ffffff",
    textShadow: "3px 3px 8px #000",
    marginTop: "20px",
    textAlign: "center",
    fontFamily: '"Press Start 2P", cursive',
    animation: "fadeIn 2s infinite alternate",
    "@keyframes fadeIn": {
      "0%": { opacity: 0.6 },
      "100%": { opacity: 1 },
    },
  }));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "30px",
  gap: "30px",
}));

const PixelButton = styled(Box)(({ theme }) => ({
    display: "inline-block",
    backgroundColor: "#3e3e8d",  // Changed to a more space-like tone
    color: "#fff",
    fontFamily: '"Press Start 2P", cursive',
    fontSize: "22px",  // Slightly increased font size
    padding: "20px 60px",
    border: "3px solid #00d9ff",  // Neon Blue Border
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.3s, background-color 0.3s, box-shadow 0.3s, border-color 0.3s",
    "&:hover": {
      backgroundColor: "#40407a",  // Slightly darker hover state
      borderColor: "#ff00ff",  // Neon Pink Border on Hover
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  }));
  

const Congthard = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [bgVolume, setBgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 0
  );

  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio(bgMusic);
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = bgVolume / 100;

    const handleClick = () => {
      audio.play().catch((error) =>
        console.error("Background music playback failed:", error)
      );
      document.removeEventListener("click", handleClick); // Remove listener after the first click
    };

    document.addEventListener("click", handleClick);

    return () => {
      // Cleanup on component unmount
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener("click", handleClick);
    };
  }, [bgVolume]);

  useEffect(() => {
    // Listen to changes in localStorage for volume sync
    const handleStorageChange = () => {
      const newVolume = parseInt(localStorage.getItem("bgVolume"), 10) || 0;
      setBgVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const gameCompleted = localStorage.getItem("gameCompleted");

    // If game was not completed, send user back
    if (!gameCompleted || gameCompleted !== "true") {
        navigate("/Play"); 
    }
}, [navigate]);

  // Navigation Handlers
  const handlePlayAgain = () => {
    navigate("/calm-hard");
  };

  const handleExit = () => {
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  return (
    <PixelBox>
      <CongratulationsText>Congratulations!</CongratulationsText>
      <SubText>Play Again?</SubText>
      <ButtonContainer>
        <PixelButton onClick={handlePlayAgain}>Yes</PixelButton>
        <PixelButton onClick={handleExit}>No</PixelButton>
      </ButtonContainer>
    </PixelBox>
  );
};

export default Congthard;
