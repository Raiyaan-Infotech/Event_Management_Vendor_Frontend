'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ChatList } from './chat-list';
import { ChatArea } from './chat-area';

const INITIAL_CHATS = [
  {
    id: 1,
    name: 'Socrates Itumay',
    image: '/images/user-avatar-12.jpg',
    unread: 2,
    time: '2 hours',
    message: 'Great. Let me send you the updated guest list.'
  },
  {
    id: 2,
    name: 'Dexter dela Cruz',
    image: '/images/user-avatar-33.jpg',
    unread: 1,
    time: '3 hours',
    message: 'Thank you Dexter. I received the confirmation email.'
  },
  {
    id: 3,
    name: 'Reynante Labares',
    image: '/images/user-avatar-44.jpg',
    unread: 0,
    time: '10 hours',
    message: 'Nam quam nunc, bl ndit vel aecenas et ante tincid',
  },
  {
    id: 4,
    name: 'Joyce Chua',
    image: '/images/user-avatar-52.jpg',
    unread: 0,
    time: '2 days',
    message: 'Yes Joyce, seeing you there at 10 am.'
  }
];

export function VendorMessagesContent() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(3); // Default to Reynante Labares

  const handleDeleteChat = (id: number) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (selectedChatId === id) {
      setSelectedChatId(null);
    }
  };

  const handleStartConversation = (contact: { id: number, name: string, image: string }) => {
    const existingChat = chats.find(c => c.name === contact.name);
    if (existingChat) {
      setSelectedChatId(existingChat.id);
    } else {
      const newChat = {
        id: Date.now(),
        name: contact.name,
        image: contact.image,
        unread: 0,
        time: 'Just now',
        message: 'No messages yet'
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
    }
  };

  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  return (
    <div className="bg-background h-[calc(100vh-64px)] flex flex-col overflow-hidden -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Chat</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap ml-1">
            14 Aug 2019 <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-[30px] items-stretch flex-1 min-h-0">
        <ChatList 
          chats={chats} 
          selectedId={selectedChatId} 
          onSelect={setSelectedChatId}
          onDelete={handleDeleteChat}
          onStartConversation={handleStartConversation}
        />
        <ChatArea selectedChat={selectedChat} />
      </div>
    </div>
  );
}
