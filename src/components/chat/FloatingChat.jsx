import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
});

export default function FloatingChat({ userType }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Conectado al servidor con ID:", socket.id);
    });

    socket.on("enviar-mensaje-front-back", (payload) => {
      console.log("📩 Mensaje recibido:", payload);
      setMessages((prev) => [...prev, { text: payload, sender: "other" }]);
    });

    return () => {
      socket.off("connect");
      socket.off("enviar-mensaje-front-back");
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    socket.emit("enviar-mensaje-front-back", inputValue);
    setMessages((prev) => [...prev, { text: inputValue, sender: "me" }]);
    setInputValue("");
  };

  return (
    <div>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-velvet text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-teal-tide transition"
        >
          💬
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-white border border-gray-light rounded-xl flex flex-col h-96 shadow-lg">
          {/* Encabezado */}
          <div className="bg-blue-velvet text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Chat ({userType})</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-tangerine transition"
            >
              ✖
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 bg-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "me"
                    ? "self-end bg-teal-tide text-white"
                    : "self-start bg-gray-light text-obsidian"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t border-gray-light">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-3 py-2 outline-none text-obsidian"
            />
            <button
              onClick={sendMessage}
              className="bg-teal-tide text-white px-4 hover:bg-blue-velvet transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
