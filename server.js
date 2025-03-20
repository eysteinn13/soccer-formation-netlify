const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('./'));

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Proxy endpoint for Claude API
app.post('/api/analyze', async (req, res) => {
    try {
        console.log('Received request to analyze:', req.body.prompt.substring(0, 100) + '...');
        
        const message = await anthropic.messages.create({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: req.body.prompt
            }]
        });

        console.log('Claude API response received:', message);
        
        // Check if the response has the expected structure
        if (message.content && Array.isArray(message.content) && message.content[0] && message.content[0].text) {
            res.json({ completion: message.content[0].text });
        } else {
            console.error('Unexpected response structure:', message);
            res.json({ completion: 'Unable to generate analysis due to an unexpected response format.' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 