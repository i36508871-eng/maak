import { useState } from "react";
import { AlertCircle, ArrowLeft, CircleUserRound, Loader2, MessageCircle } from "lucide-react";
import { useProviders } from "../hooks/useProviders";
import { Avatar } from "../components/atoms";
import { useLanguage } from "../i18n";

export default function Chat() {
  const { t } = useLanguage();
  const { providers, status } = useProviders();
  const [text, setText] = useState("");
  const peer = providers[0];

  return (
    <main className="screen chat-screen">
      <div className="chat-panel">
        <div className="chat-person">
          {status === "loading" ? (
            <div className="state-loading"><Loader2 className="spin" size={22} /><p>{t("common.loading")}</p></div>
          ) : status === "error" || !peer ? (
            <div className="state-error"><AlertCircle size={20} /><b>{t("chat.noConversation")}</b></div>
          ) : (
            <>
              <Avatar name={peer.name} src={peer.image} />
              <div>
                <b>{peer.name}</b>
                <small>{t("chat.availableOn")}</small>
              </div>
              <span className="chat-call"><CircleUserRound size={18} /></span>
            </>
          )}
        </div>
        <div className="messages messages-empty">
          <span className="empty-msg"><MessageCircle size={26} /></span>
          <h3>{t("chat.noMessages")}</h3>
          <p>{t("chat.noMessagesBody")}</p>
        </div>
        <div className="message-compose">
          <input className="field" value={text} disabled onChange={(e) => setText(e.target.value)} placeholder=t("chat.noMessages") />
          <button className="primary send-button" disabled aria-label=t("common.send")><ArrowLeft size={16} /></button>
        </div>
      </div>
    </main>
  );
}
