import React, { useState, useEffect } from 'react';
import './App.css';
import { UserProvider } from './components/UserContext.jsx';
import Header from './components/Header.jsx';
import Question from './components/Question.jsx';
import Results from './components/Results.jsx';
import UserForm from './components/UserForm.jsx';
import { Routes, Route, Router } from "react-router-dom";
import { useLocation } from 'react-router-dom';


function App() {
  const[currentQuestionIndex,setCurrentQuestionIndex]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[userName,setUserName]=useState("");
  const[element,setElement]=useState("");
  const[artwork,setArtwork]=useState(null);
  const location = useLocation(); 
  const[selectedElement,setSelectedElement]=useState("");

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  function handleUserFormSubmit(name) {
      setUserName(name);
  };
  
  function determineElement(answers) {
    
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;

    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
    
  };

  


  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "What's your favorite drink?",
      options: ["Wine 🍷", "Blue Lagoon 🧉", "Mohito 🍸", "Lemon juice 🍹"],
    },
    {
      question: "What's your favorite music type?",
      options: ["Jazz 🎺", "Rap 🎤", "Pop 🧋", "Classic 🎹"],
    }
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
    Elegant: "water",
    Crazy: "fire",
    Intelligent: "air",
    Decent: "earth",
    Classic: "earth",
    Aggressive: "fire",
    Chill: "water",
    Peaceful: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    "Wine 🍷": "Elegant",
    "Blue Lagoon 🧉": "Crazy",
    "Mohito 🍸": "Intelligent",
    "Lemon juice 🍹": "Decent",
    "Jazz 🎺": "Classic",
    "Rap 🎤": "Aggressive",
    "Pop 🧋": "Chill",
    "Classic 🎹": "Peaceful",


  };

  useEffect(
    function () {
    if (location.pathname === '/') {
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setElement("");
      setArtwork(null);
      setUserName("");
    } else if (currentQuestionIndex === questions.length) {
      setSelectedElement(determineElement(answers));
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
      console.log("Element:", selectedElement);
      console.log("Answers:", answers);
      console.log("Keyword:", keywords);
    }
  }, [location.pathname, currentQuestionIndex]); 


  async function fetchArtwork(requestString) {
    try {
      let requestString=answers.map(answer => elements[answer]).join(' ').toLowerCase();

      console.log("Requesting artwork for:", requestString);
      const search = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${requestString}&isOnView=true`);
      const data1 = await search.json();

      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${data1.objectIDs[12]}`);
      const data = await response.json();
      if (data) {
        setArtwork(data);
      } else {
        setArtwork(null);
      }
 
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setArtwork(null);
    }
  }


  return (
    <div className='App'>
      <UserProvider value={{ name: userName, setName: setUserName }}>
        <Header/>
        <Routes>
            <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
            <Route
              path="/quiz"
              element={
                currentQuestionIndex < questions.length ? (
                  <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
                ) : (
                  <Results element={keywords[selectedElement]} artwork={artwork} />
                )
              }
            />
        </Routes>
        </UserProvider>
        </div>
  );
}

export default App
