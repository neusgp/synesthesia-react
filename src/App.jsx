import { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faGear,
  faMicrophone,
  faMicrophoneSlash,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { Canvas } from "./Canvas";

import { defaultNoteColors } from "./colors";

function App() {
  const [isStart, setIsStart] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [noteColors, setNoteColors] = useState(defaultNoteColors);

  const handleNoteColorChange = ({ key: changedNote, value: newColor }) => {
    const newNoteColors = noteColors.map(({ note, color }) => {
      return note === changedNote ? { note, color: newColor } : { note, color };
    });
    setNoteColors(newNoteColors);
  };

  const microphoneButtonStyle = isRecording
    ? "text-slate-300"
    : "text-lime-400";

  return (
    <>
      <div id="app">
        {!isStart ? (
          <div className="border border-slate-100 rounded-lg shadow-sm py-20 px-10 flex flex-col items-center gap-8 self-center">
            <h1 className="text-[32px] uppercase text-center">
              welcome to synesthesia
            </h1>
            <p className="text-center">
              This playground is inspired by the idea of connecting sounds and
              colors.
            </p>
            <button
              type="button"
              aria-label="Start recording"
              className="bg-lime-400 px-10 py-3 rounded-[50px] uppercase cursor-pointer font-bold"
              onClick={() => setIsStart(true)}>
              start
            </button>
          </div>
        ) : (
          <>
            <div
              id="settings"
              className="mt-[50px] h-[60px] flex justify-center">
              {showRecordingControls && (
                <div
                  id="recording-controls"
                  className="flex justify-center align-center gap-8 py-2 px-6 rounded-lg border border-slate-300 self-center">
                  <button
                    id="pause-recording"
                    type="button"
                    aria-label="Pause recording"
                    className="text-[32px] text-cyan-400 cursor-pointer"
                    onClick={() => setIsRecording(false)}>
                    <FontAwesomeIcon icon={faPause} />
                  </button>
                  <button
                    type="button"
                    aria-label="Stop recording"
                    className="text-[32px] text-red-600 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faMicrophoneSlash}
                      onClick={() => {
                        setIsRecording(false);
                        setShowRecordingControls(false);
                      }}
                    />
                  </button>

                  <button
                    id="record"
                    type="button"
                    disabled={isRecording}
                    aria-label="Start recording"
                    className={`text-[32px] ${microphoneButtonStyle} cursor-pointer`}
                    onClick={() => setIsRecording(true)}>
                    <FontAwesomeIcon icon={faMicrophone} />
                  </button>
                </div>
              )}
              <div className="flex self-center absolute right-[40px]">
                <button
                  type="button"
                  aria-label="Open settings"
                  className="text-[40px] cursor-pointer"
                  onClick={() => setShowSettings(true)}>
                  <FontAwesomeIcon icon={faGear} />
                </button>
                {!showRecordingControls && (
                  <div className="absolute bg-slate-700 flex top-[50px] right-[40px] w-34 p-4 rounded-tl-lg rounded-b-lg">
                    <p className="text-white font-semibold text-xs">
                      Explore the mode and color settings
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!isRecording && !showRecordingControls ? (
              <div id="main-record-button">
                <button
                  type="button"
                  className="w-[180px] h-[180px] rounded-full border border-3 border-lime-400 flex justify-center items-center text-[70px] text-lime-400 cursor-pointer"
                  onClick={() => {
                    setIsRecording(true);
                    setShowRecordingControls(true);
                  }}>
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>
                <div className="absolute bg-slate-700 flex w-38 p-4 bottom-[-78px] left-[-60px] rounded-tl-lg rounded-b-lg">
                  <p className="text-white font-semibold text-xs">
                    Press the microphone to start recording
                  </p>
                </div>
              </div>
            ) : (
              <Canvas />
            )}
          </>
        )}
      </div>
      {showSettings && (
        <div
          id="settings-panel"
          className="absolute w-full h-full bg-white flex flex-col justify-center items-center ">
          <button
            type="button"
            aria-label="Open settings"
            className="flex text-[40px] cursor-pointer absolute right-[45px] top-[60px]"
            onClick={() => setShowSettings(false)}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <div className="flex flex-col w-[70%] gap-10">
            <div>
              <p>Mode</p>
              <select
                type="select"
                className="border border-slate-300 w-[100%]">
                {/* options disabled for the moment */}
                <option>Free</option>
                <option disabled>Mouse</option>
                <option disabled>Tuner</option>
              </select>
            </div>
            <div>
              <p>Palette</p>
              {/* disabled for the moment */}
              <select
                disabled
                type="select"
                className="border border-slate-300 w-[100%]">
                <option value="free">Kandinsky</option>
                <option value="mouse">Ellington</option>
              </select>
            </div>
            <div
              id="color-pickers"
              className="grid grid-cols-4 w-[100%] gap-y-4 gap-x-2">
              {noteColors.map(({ note, color }) => {
                return (
                  <div className="flex flex-col items-center" key={note}>
                    <p className={`font-semibold`}>{note}</p>
                    <input
                      type="color"
                      defaultValue={color}
                      className="h-[70px] w-[100%]"
                      onChange={(e) =>
                        handleNoteColorChange({
                          key: note,
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
