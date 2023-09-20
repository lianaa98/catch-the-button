import React, { useState, useEffect } from "react";
import "./styles/landing.css";
import { Modal } from "./Modal";

export function Landing() {
  const [buttonWrapPosition, setButtonWrapPosition] = useState(null);
  const [flapPosition, setFlapPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [trueButtonAppear, setTrueButtonAppear] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [winningModalOpen, setWinningModalOpen] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState(null);
  const [winningSpeech, setWinningSpeech] = useState(null);

  const speeches = [
    "ouch!",
    "that hurts!",
    "stop it!",
    "that's not nice!",
    "you're mean!",
    "stop!",
  ];

  const winningSpeeches = [
    "huh?! you found me!",
    "alright alright, you got me!",
    "you won!!",
  ];

  useEffect(() => {
    const buttonWrap = document.getElementById("landing_button_wrap");
    const buttonRect = buttonWrap.getBoundingClientRect();
    setButtonWrapPosition({
      left: buttonRect.left,
      top: buttonRect.top,
      width: buttonRect.width,
      height: buttonRect.height,
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      if (isDragging) {
        const flap = document.getElementById("flap");
        const flapRect = flap.getBoundingClientRect();
        const { left, top, width, height } = flapRect;

        const newLeft = clientX - width / 2;
        const newTop = clientY - height / 2;

        if (
          newLeft >= 0 &&
          newLeft + width <= pageWidth &&
          newTop >= 0 &&
          newTop + height <= pageHeight
        ) {
          flap.style.position = "absolute";
          flap.style.left = `${newLeft}px`;
          flap.style.top = `${newTop}px`;
          setTrueButtonAppear(true);
        }
      }

      if (buttonWrapPosition) {
        const { left, top, width, height } = buttonWrapPosition;

        const threshold = 20;

        const isCloseToLeft =
          left - clientX <= threshold && left - clientX >= 0;
        const isCloseToRight =
          clientX - left - width <= threshold && clientX - left - width >= 0;
        const isCloseToTop = top - clientY <= threshold && top - clientY >= 0;
        const isCloseToBottom =
          clientY - top - height <= threshold && clientY - top - height >= 0;

        let newLeft = left;
        let newTop = top;

        if (
          left <= 0 ||
          left + width >= pageWidth ||
          top <= 0 ||
          top + height >= pageHeight
        ) {
          newLeft = pageWidth / 2 - width / 2;
          newTop = pageHeight / 2 - height / 2;
        }

        if (isCloseToLeft) {
          newLeft = clientX + threshold;
        } else if (isCloseToRight) {
          newLeft = clientX - width - threshold;
        }

        if (isCloseToTop) {
          newTop = clientY + threshold;
        } else if (isCloseToBottom) {
          newTop = clientY - threshold - height;
        }

        const buttonWrap = document.getElementById("landing_button_wrap");
        buttonWrap.style.left = `${newLeft}px`;
        buttonWrap.style.top = `${newTop}px`;

        setButtonWrapPosition({
          left: newLeft,
          top: newTop,
          width: width,
          height: height,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [buttonWrapPosition]);

  function handleMouseDown(e) {
    const flap = document.getElementById("flap");
    const flapRect = flap.getBoundingClientRect();
    const { left, top, width, height } = flapRect;
    setFlapPosition({
      left: left,
      top: top,
      width: width,
      height: height,
    });

    const { clientX, clientY } = e;
    const isInsideFlap =
      clientX >= left &&
      clientX <= left + width &&
      clientY >= top &&
      clientY <= top + height;

    if (isInsideFlap) {
      setIsDragging(true);
    }
  }

  function handleMouseUp(e) {
    setIsDragging(false);
    console.log("not dragging");
    const flap = document.getElementById("flap");
    const flapRect = flap.getBoundingClientRect();
    const { left, top, width, height } = flapRect;

    setFlapPosition({
      left: left,
      top: top,
      width: width,
      height: height,
    });
  }

  return (
    <div className="landing_page">
      <div className="landing_title">
        <h1 id="landing_title_left">catch the</h1>
        <h1
          id="flap"
          onMouseDown={(e) => {
            handleMouseDown(e);
          }}
          onMouseUp={(e) => {
            handleMouseUp(e);
          }}
        >
          button
        </h1>
        {trueButtonAppear && (
          <button
            id="true_button"
            onClick={() => {
              setWinningSpeech(
                winningSpeeches[
                  Math.floor(Math.random() * winningSpeeches.length)
                ]
              );
              setWinningModalOpen(true);
            }}
          >
            ?!
          </button>
        )}
        {winningModalOpen && <Modal currentSpeech={winningSpeech} />}
      </div>

      <div id="landing_button_wrap">
        <button
          id="landing_button"
          onClick={() => {
            const button = document.getElementById("landing_button");
            button.style.boxShadow = "none";
            setCurrentSpeech(
              speeches[Math.floor(Math.random() * speeches.length)]
            );
            setModalOpen(true);
            setTimeout(() => {
              button.style.boxShadow = "0px 6px 0px 0px #f265ebbf";
            }, 300);
          }}
        ></button>
        {modalOpen && <Modal currentSpeech={currentSpeech} />}
      </div>
    </div>
  );
}
