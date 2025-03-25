import React, { useRef, useEffect } from "react";

//turn to a set (more efficient)
const getColor = ({ currentNote, palette }) => {
    const note = palette.find(({ note }) => {
        return note === currentNote;
    });
    return note.color;
};

export const Canvas = ({ palette }) => {
    console.log('palette', palette);

    const sketchRef = useRef(null);

    useEffect(() => {
        let isMicActive, mic;

        if (window.ml5 && window.p5) {
            const sketch = (p) => {
                let currentColor;
                let audioContext, pitch;


                let vol = 0.0;
                let noteScale = [
                    "C",
                    "#c",
                    "D",
                    "#d",
                    "E",
                    "F",
                    "#f",
                    "G",
                    "#g",
                    "A",
                    "#a",
                    "B",
                ];

                p.setup = () => {
                    let currentNote;

                    const getPitch = () => {
                        pitch.getPitch((err, frequency) => {
                            if (frequency) {
                                let midiNum = p.freqToMidi(frequency);
                                currentNote = noteScale[midiNum % 12];
                                currentColor = getColor({
                                    currentNote,
                                    palette,
                                });
                                vol = mic.getLevel();
                            }
                            if (!!err) {
                                console.error("error getting frequency", err);
                            }
                            getPitch();
                        });
                    };

                    const modelLoaded = () => {
                        getPitch();
                    };

                    const startPitch = () => {
                        pitch = ml5.pitchDetection(
                            "/crepe",
                            audioContext,
                            mic.stream,
                            modelLoaded
                        );
                    };

                    const canvas = p.createCanvas(2000, 800);

                    //userStartAudio: required p5 action
                    p.userStartAudio();
                    //getting context neccessar fro the pitch detection
                    audioContext = p.getAudioContext();

                    //seting up the microphone
                    mic = new p5.AudioIn();

                    //recording starts
                    mic.start(() => {
                        isMicActive = true;
                        startPitch();
                    });
                    //pause recording
                    const pauseButton = document.getElementById("pause-recording");
                    pauseButton.addEventListener("click", () => {
                        isMicActive = false;
                        mic.stop();
                        console.log('mic stopped');
                    });
                    //continue recording
                    const recordButton = document.getElementById("record");
                    recordButton.addEventListener("click", () => {
                        isMicActive = true;
                        mic.start(() => startPitch());
                        console.log('mic started');
                    });
                };
                p.draw = () => {
                    if (isMicActive) {
                        currentColor && p.fill(currentColor);
                        p.noStroke();
                        p.ellipse(p.random(2000), p.random(800), vol * 1000);
                    }
                };
            };
            const p5Instance = new p5(sketch, sketchRef.current);

            return () => {
                p5Instance.remove(); // Cleanup p5 instance when component is unmounted
            };
        }
    }, [palette]);

    return (
        <div
            className="border border-slate-200 rounded-lg w-[100%] h-full mt-10 overflow-hidden"
            ref={sketchRef}></div>
    );
};
