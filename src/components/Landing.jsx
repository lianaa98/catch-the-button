import React, { useState, useEffect } from "react";
import "./styles/landing.css";
import { Modal } from "./Modal";

export function Landing() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [buttonWrapPosition, setButtonWrapPosition] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState(null);

  const speeches = [
    "ouch!",
    "that hurts!",
    "stop it!",
    "that's not nice!",
    "you're mean!",
    "stop!",
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
      setCursorPosition({ x: clientX, y: clientY });

      if (buttonWrapPosition) {
        const { left, top, width, height } = buttonWrapPosition;

        const threshold = 20;
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;

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

  return (
    <div className="landing_page">
      <h1 className="landing_title">catch the button</h1>
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
