import React, { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const App = () => {
  const [input, setInput] = useState("")
  const [chat, setChat] = useState([])

  const sendMessage = async () => {
    if (!input) return

    const newChat = [...chat, { role: "user", text: input }]
    setChat(newChat)
    setInput("")

    try {
      const res = await axios.post("http://localhost:4000/chat", {
        message: input
      })

      setChat([...newChat, { role: "bot", text: res.data.reply }])
    } catch (error) {
      console.error("error:", error)
    }
  }

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="border rounded" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="p-2 border-bottom text-center">
          <strong>AI Chat</strong>
        </div>

        <div className="p-3" style={{ height: "350px", overflowY: "auto" }}>
          {chat.length === 0 && (
            <p className="text-muted text-center">Say something...</p>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.role === "user" ? "text-end" : "text-start"}`}
            >
              <div
                className={`d-inline-block px-3 py-2 rounded ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-light text-dark border"
                }`}
                style={{ maxWidth: "100%", fontSize: "14px" }}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-top">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

