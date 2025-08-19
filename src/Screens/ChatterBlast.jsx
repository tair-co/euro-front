import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../utils/ApiRequest";
import TokenModal from "../components/TokenModal";

const typeWriterEffect = async (fullText, setText, startIndex, onFinish) => {
  for (let i = startIndex; i < fullText.length; i++) {
    await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 19) + 2));
    setText((prev) => prev.replace(/\|$/, "") + fullText[i] + "|");
  }
  setText((prev) => prev.replace(/\|$/, "")); // убрать курсор
  onFinish(fullText.length);
};

const ChatterBlast = () => {
  const [message, setMessage] = useState("");
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState(null);
  const [enabled, setEnabled] = useState(false);

  const [conversationId, setConversationId] = useState(null);
  const [isFinal, setIsFinal] = useState(false);

  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);

  const [modalClosed, setModalClosed] = useState(true);

  // check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokens = [
      "8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91",
      "13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6",
    ];
    if (token && tokens.includes(token)) {
      setEnabled(true);
    } else {
      setModalClosed(false);
    }
  }, []);

  useEffect(() => {
    if (!conversationId || isFinal) return;

    let printedLength = 0;
    let typing = false;

    const interval = setInterval(async () => {
      if (typing) return;

      const result = await apiGet(`/chat/conversation/${conversationId}`);

      const fullText = (result.response || "").replace(/<EOF>.*/, "");

      if (fullText.length > printedLength) {
        typing = true;
        typeWriterEffect(
          fullText,
          setResponseText,
          printedLength,
          (newPrinted) => {
            printedLength = newPrinted;
            typing = false;
          }
        );
      }

      if (result.is_final) {
        setIsFinal(true);
        setSubmitBtnDisabled(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationId, isFinal]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setSubmitBtnDisabled(true);

    setResponseText("");
    try {
      const response = await apiPost("/chat/conversation", { prompt: message });

      setConversationId(response.conversation_id);
      setResponseText(response.response);
      setIsFinal(response.is_final);

      if (response.is_final) {
        setSubmitBtnDisabled(false);
      }
    } catch (err) {
      setError(`Failed to fetch response: ${err}`);
    }
  };

  const startNewConversation = () => {
    setMessage("");
    setResponseText("");
    setError(null);
    setConversationId(null);
    setIsFinal(false);
  };
  const closeModalHandler = () => {
    setModalClosed(true);
    setEnabled(true);
    window.reload();
  };
  return (
    <>
      {!modalClosed && <TokenModal closeModal={closeModalHandler} />}
      <h1 className=" mb-3">ChatterBlast</h1>
      <div className=" d-flex flex-column">
        <p>Chat Bot Answer:</p>

        <div className="chat__messages" style={{ minWidth: "300px" }}>
          {responseText}
        </div>
        <p>Your Message: </p>
        {enabled && (
          <form onSubmit={submitHandler}>
            <textarea
              className="form-control"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <br />
            <button
              type="submit"
              className="btn btn-primary mt-2 "
              style={{ marginRight: "10px" }}
              disabled={!message || submitBtnDisabled}
            >
              {conversationId ? "Continue" : "Start"} Conversation
            </button>
            <button
              type="button"
              className="btn btn-danger mt-2"
              style={{ marginRight: "10px" }}
              disabled={!message}
            >
              Clean
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={startNewConversation}
              disabled={!isFinal}
            >
              New Conversation
            </button>
          </form>
        )}
        {!enabled && (
          <p className="text-danger">Please login to use the chat feature.</p>
        )}
      </div>
      {error && <p className="text-danger">{error}</p>}
    </>
  );
};

export default ChatterBlast;
