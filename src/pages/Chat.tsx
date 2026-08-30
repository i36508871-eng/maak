import { useState } from "react";
import { ArrowLeft, CircleUserRound } from "lucide-react";
import { getProviders } from "../services";

function PhoneIcon() {
  return <span className="chat-call"><CircleUserRound size={18} /></span>;
}

export default function Chat() {
  const providers = getProviders();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    "السلام عليكم، محتاج سباك اليوم.",
    "وعليكم السلام، مرحبا. شنو المشكل؟",
    "عندي تسريب فالمطبخ.",
    "نقدر نجيو عندك اليوم، ونتفاهمو على الثمن من بعد ما نشوف المشكل.",
  ]);
  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, text.trim()]);
    setText("");
  };
  return (
    <main className="screen chat-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">تواصل مباشر</span>
          <h1>الرسائل</h1>
        </div>
      </div>
      <div className="chat-panel panel">
        <div className="chat-person">
          <img src={providers[0].image} alt="" />
          <div>
            <b>{providers[0].name}</b>
            <small>
              <span /> متصل الآن · إصلاح التسربات
            </small>
          </div>
          <PhoneIcon />
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`message ${index % 2 ? "received" : "sent"}`}
              key={`${message}-${index}`}
            >
              {message}
            </div>
          ))}
        </div>
        <div className="message-compose">
          <input
            className="field"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="كتب رسالة..."
          />
          <button className="primary send-button" onClick={send}>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}