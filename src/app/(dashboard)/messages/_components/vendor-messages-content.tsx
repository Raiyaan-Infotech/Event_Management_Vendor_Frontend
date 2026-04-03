'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ChatList } from './chat-list';
import { ChatArea } from './chat-area';
import { PageHeader } from '@/components/common/PageHeader';

const INITIAL_CHATS = [
  {
    id: 1,
    name: 'Socrates Itumay',
    image: '/images/user-avatar-1.jpg',
    unread: 2,
    time: '2 hours',
    message: 'Great. Let me send you the updated guest list.'
  },
  {
    id: 2,
    name: 'Dexter dela Cruz',
    image: '/images/user-avatar-2.jpg',
    unread: 1,
    time: '3 hours',
    message: 'Thank you Dexter. I received the confirmation email.'
  },
  {
    id: 3,
    name: 'Reynante Labares',
    image: '/images/user-avatar-3.jpg',
    unread: 0,
    time: '10 hours',
    message: 'Nam quam nunc, bl ndit vel aecenas et ante tincid',
  },
  {
    id: 4,
    name: 'Joyce Chua',
    image: '/images/user-avatar-4.jpg',
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

  const handleMarkAsRead = (id: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, unread: 0 } : chat
    ));
  };

  const handleMarkAsUnread = (id: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, unread: 1 } : chat
    ));
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
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar font-['Roboto',sans-serif]">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <PageHeader 
          title="Chat" 
          subtitle="Manage your conversations with clients and staff." 
          total={chats.length}
        />

        <div className="flex flex-col lg:flex-row gap-[30px] items-stretch flex-1 min-h-0">
        <ChatList 
          chats={chats} 
          selectedId={selectedChatId} 
          onSelect={setSelectedChatId}
          onDelete={handleDeleteChat}
          onStartConversation={handleStartConversation}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
        />
        <ChatArea selectedChat={selectedChat} />
      </div>
    </div>
  </div>
);
}
