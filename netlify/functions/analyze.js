const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

        const { prompt } = JSON.parse(event.body);
        console.log('Analyzing setup with prompt:', prompt.substring(0, 100) + '...');

        const message = await anthropic.messages.create({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        console.log('Received response from Claude');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ completion: message.content[0].text })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 