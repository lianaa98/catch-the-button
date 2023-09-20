import "./styles/landing.css";

export function Modal(props) {
  const { currentSpeech } = props;

  return (
    <div className="modal">
      <div className="modal_content">
        <p>{currentSpeech}</p>
      </div>
    </div>
  );
}
