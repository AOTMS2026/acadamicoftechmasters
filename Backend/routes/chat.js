const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!process.env.OPEN_ROUTER_API_KEY) {
            console.error("Missing OPEN_ROUTER_API_KEY in environment variables");
            return res.status(500).json({ message: "Chat service configuration error" });
        }

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Invalid messages format" });
        }

        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
            const lowerText = lastMessage.content.trim().toLowerCase();
            if (lowerText === 'hi' || lowerText === 'hello') {
                return res.json({
                    choices: [{
                        message: {
                            role: "assistant",
                            content: "Sure! The Academy of Tech Masters offers premium training in Java, Python, and Full Stack Development. Would you like to know about a specific course?"
                        }
                    }]
                });
            }
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
                "X-Title": "AOTMS Chatbot",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // Fallback to standard model or use deepseek/deepseek-chat if reliable
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful and knowledgeable AI assistant for the Academy of Technology Masters (AOTMS). Your goal is to assist students and visitors with questions about courses, placements, internships, and general programming inquiries. Be polite, professional, and concise."
                    },
                    ...messages
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", errorText);
            throw new Error(`OpenRouter responded with ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Chat API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch chat response" });
    }
});

module.exports = router;
