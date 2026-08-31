import { useState } from "react";
import { AlertCircle, ArrowLeft, CircleUserRound, Loader2, MessageCircle } from "lucide-react";
import { useProviders } from "../hooks/useProviders";
import { Avatar } from "../components/atoms";

export default function Chat() {
  const { providers, status } = useProviders();
  const [text, setText] = useState("");
  const peer = providers[0];

  return (
    <main className="screen chat-screen">
      <div className="chat-panel">
        <div className="chat-person">
          {status === "loading" ? (
            <div className="state-loading"><Loader2 className="spin" size={22} /><p>جارٍ التحميل…</p></div>
          ) : status === "error" || !peer ? (
            <div className="state-error"><AlertCircle size={20} /><b>لا توجد محادثة</b></div>
          ) : (
            <>
              <Avatar name={peer.name} src={peer.image} />
              <div>
                <b>{peer.name}</b>
                <small>متاح للتواصل عبر منصة معاك</small>
              </div>
              <span className="chat-call"><CircleUserRound size={18} /></span>
            </>
          )}
        </div>
        <div className="messages messages-empty">
          <span className="empty-msg"><MessageCircle size={26} /></span>
          <h3>لا توجد رسائل بعد</h3>
          <p>ستظهر محادثاتك مع مقدمي الخدمة هنا عند توفّرها.</p>
        </div>
        <div className="message-compose">
          <input className="field" value={text} disabled onChange={(e) => setText(e.target.value)} placeholder="لا توجد رسائل بعد" />
          <button className="primary send-button" disabled aria-label="إرسال"><ArrowLeft size={16} /></button>
        </div>
      </div>
    </main>
  );
}
