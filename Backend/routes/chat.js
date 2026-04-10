const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Invalid messages format" });
        }

        // Use n8n webhook URL from environment variables or the provided default
        const n8nWebhookUrl = process.env.N8N_CHATBOT_WEBHOOK_URL || "https://aotms.app.n8n.cloud/webhook/Aotms_chatbot";
        
        const lastMessage = messages[messages.length - 1];
        const chatInput = lastMessage ? lastMessage.content : "";

        // Sending a clean structure for n8n. In n8n AI node, use: {{ $json.body.message }}
        console.log("Calling n8n Webhook:", n8nWebhookUrl);
        const response = await axios.post(n8nWebhookUrl, {
            chatInput: chatInput,
            message: chatInput, // Added for dual compatibility with n8n AI nodes
            sessionId: req.body.sessionId || "default-session",
            messages: messages
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        // n8n response handling:
        console.log("n8n Response received:", JSON.stringify(response.data));
        let botContent = "";
        
        const data = response.data;
        // Check if n8n returned an object with 'output' directly (Respond to Webhook node)
        if (data && data.output) {
            botContent = data.output;
        } else if (data && data.response) {
            botContent = data.response;
        } else {
            // Fallback to array/first element logic
            const firstElement = Array.isArray(data) ? data[0] : data;

            if (typeof data === 'string') {
                botContent = data;
            } else if (firstElement) {
                botContent = firstElement.output || 
                             firstElement.response || 
                             firstElement.message || 
                             firstElement.text || 
                             firstElement.answer || 
                             (firstElement.choices && firstElement.choices[0]?.message?.content) ||
                             (typeof firstElement === 'string' ? firstElement : JSON.stringify(data));
            } else {
                botContent = "I received an empty response. Please try again.";
            }
        }

        res.json({
            choices: [{
                message: {
                    role: "assistant",
                    content: botContent
                }
            }]
        });

    } catch (error) {
        console.error("Chat API Error (n8n):", error.message);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("n8n Error Status:", error.response.status);
            console.error("n8n Error Data:", JSON.stringify(error.response.data));
            
            return res.status(error.response.status).json({
                message: error.response.status === 404 
                    ? "n8n Webhook not found. Ensure the workflow is ACTIVE in n8n and the URL is correct." 
                    : "n8n Workflow Error",
                details: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error("n8n No Response Received:", error.request);
            return res.status(504).json({
                message: "n8n server took too long to respond or is unreachable.",
                details: error.message
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({ 
                message: "Failed to initialize request to n8n", 
                details: error.message 
            });
        }
    }
});

module.exports = router;