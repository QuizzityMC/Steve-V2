import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

const API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B";

export default function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, `You: ${input}`]);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`
        },
        body: JSON.stringify({ 
          inputs: `Human: ${input}\nAI:`,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          }
        }),
      });

      const data = await response.json();
      let botReply = data[0].generated_text.split('AI:')[1].trim();
      
      // Ensure the reply ends with a complete sentence
      const lastSentenceEnd = Math.max(
        botReply.lastIndexOf('.'),
        botReply.lastIndexOf('!'),
        botReply.lastIndexOf('?')
      );
      if (lastSentenceEnd !== -1) {
        botReply = botReply.substring(0, lastSentenceEnd + 1);
      }

      setMessages(prev => [...prev, `Steve: ${botReply}`]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, "Steve: Sorry, I'm having trouble responding right now."]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat with Steve (GPT-J-6B)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded ${message.startsWith('You:') ? 'bg-blue-100' : 'bg-green-100'}`}>
              {message}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

