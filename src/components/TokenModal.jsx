import { useState } from "react";

// TokenModal component
const TokenModal = ({ closeModal }) => {
  const [inputValue, setInputValue] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();

    const tokens = [
      "8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91",
      "13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6",
    ];

    if (inputValue && inputValue.trim() !== "" && tokens.includes(inputValue)) {
      localStorage.setItem("token", inputValue);
      closeModal();
    }
  };
  return (
    <div className="token__modal">
      <h2 className=" text-danger">The Api token is invalid 401</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={inputValue}
          placeholder="Enter new token"
          className="form-control"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default TokenModal;
