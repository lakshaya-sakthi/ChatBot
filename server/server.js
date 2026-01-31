require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenAI } = require('@google/genai')

const app = express()
app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY)

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" })
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    })

    res.json({ reply: response.text })

  } catch (e) {
    res.status(500).json({ e: "error generating response" })
  }
})

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000')
})

