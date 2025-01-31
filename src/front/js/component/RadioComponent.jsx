import React, { useState, useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "../../styles/RadioComponent.css";

const RadioComponent = () => {
  const audioRef = useRef(null);
  const plyrRef = useRef(null);

  const [radioUrl, setRadioUrl] = useState("https://amoris.sknt.ru/dnb.mp3");

  const radioStations = [
    "https://amoris.sknt.ru/dnb.mp3",
    "http://ice1.somafm.com/bootliquor-128-mp3",
    "http://streams.bigfm.de/bigfm-nitroxdeep-128-mp3",
    "http://radio.canstream.co.uk:8075/live.mp3?"
  ];

  useEffect(() => {
    if (audioRef.current) {
      plyrRef.current = new Plyr(audioRef.current);

      return () => plyrRef.current.destroy();
    }
  }, []);

  const toggleRadio = () => {
    const currentIndex = radioStations.indexOf(radioUrl);
    const nextIndex = (currentIndex + 1) % radioStations.length;
    setRadioUrl(radioStations[nextIndex]);
  };

  useEffect(() => {
    if (audioRef.current) {
      const isPlaying = !audioRef.current.paused;

      audioRef.current.src = radioUrl;

      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [radioUrl]);

  return (
    <div className="radio-container">
      <h4>📻 Live Radio!</h4>
      <audio ref={audioRef} controls>
        <source src={radioUrl} type="audio/mp3" />
        Tu navegador no soporta el reproductor de audio.
      </audio>
      <div>
        <button onClick={toggleRadio} className="btn-toggle-radio">
          Cambiar Radio
        </button>
      </div>
    </div>
  );
};

export default RadioComponent;















