// llmClient.js
const { Ollama } = require('ollama');

const client = new Ollama({ host: 'http://127.0.0.1:11434' });
let full = '';
async function callLLM(prompt) {
  try {
    console.log('Calling Ollama (streaming)...');
    
    const stream = await client.chat({
      model: 'deepseek-coder:6.7b',
      messages: [
        { role: 'system', content: 'You are a senior TypeScript and Playwright test engineer.' },
        { role: 'user', content: prompt }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.message && chunk.message.content) {
        process.stdout.write(chunk.message.content);
        full += chunk.message.content;
      }
    }

    // console.log('\n\nFull message:', full);
  } catch (err) {
    console.error('Error calling Ollama:', err);
  }

  return full;
}

module.exports = { callLLM };
