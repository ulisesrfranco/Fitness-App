'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Activity, Moon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoachPage() {
  const { data: session } = useSession() || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setMessages(data?.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText?.trim() || loading) return;

    setInput('');
    setLoading(true);

    // Add user message immediately
    const userMessage = { role: 'user', content: messageText, createdAt: new Date() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Add empty assistant message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '', createdAt: new Date() },
      ]);

      while (true) {
        const { done, value } = (await reader?.read()) || {};
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data?.content) {
                assistantMessage += data.content;
                // Update last message (assistant)
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: assistantMessage,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { text: 'How should I train today?', icon: Activity },
    { text: 'What should I eat next?', icon: Zap },
    { text: 'I\'m too tired to cook', icon: Moon },
    { text: 'Adjust my calories', icon: Activity },
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Coach</h1>
          <p className="text-sm text-gray-600">Ask me anything about training, nutrition, or recovery</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages?.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Your AI Coach!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                I'm here to help with your fitness journey. Ask me about training, nutrition, recovery, or anything health-related.
              </p>
            </div>
          )}

          {messages?.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                msg?.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                  msg?.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg?.content}</p>
              </div>
            </div>
          ))}

          {loading && messages?.[messages.length - 1]?.role === 'assistant' && messages?.[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-16 md:bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Quick Actions */}
          {messages?.length === 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.text)}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left disabled:opacity-50"
                  >
                    <action.icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-900">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 min-h-[44px] max-h-32 resize-none"
              disabled={loading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input?.trim()}
              className="px-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
