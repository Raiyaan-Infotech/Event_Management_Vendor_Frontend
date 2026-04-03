import React, { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Trash2, Search, CheckCheck, CircleDashed } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const cardClass = 'bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none font-["Roboto",sans-serif]';

interface ChatItem {
  id: number;
  name: string;
  image: string;
  unread: number;
  time: string;
  message: string;
}

interface ChatListProps {
  chats: ChatItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onStartConversation: (contact: { id: number, name: string, image: string }) => void;
  onMarkAsRead: (id: number) => void;
  onMarkAsUnread: (id: number) => void;
}

const ALL_CONTACTS = [
  { id: 1, name: 'Socrates Itumay', image: '/images/user-avatar-1.jpg', status: 'Online' },
  { id: 2, name: 'Dexter dela Cruz', image: '/images/user-avatar-2.jpg', status: 'Online' },
  { id: 3, name: 'Reynante Labares', image: '/images/user-avatar-3.jpg', status: 'Offline' },
  { id: 4, name: 'Joyce Chua', image: '/images/user-avatar-4.jpg', status: 'Online' },
  { id: 101, name: 'Adrian Monino', image: '/images/user-avatar-5.jpg', status: 'Online' },
  { id: 102, name: 'Barney Shrew', image: '/images/user-avatar-6.jpg', status: 'Offline' },
  { id: 103, name: 'Charlene Reed', image: '/images/user-avatar-7.jpg', status: 'Online' },
  { id: 104, name: 'Denis Rose', image: '/images/user-avatar-8.jpg', status: 'Online' },
  { id: 105, name: 'Eddie Lobanovskiy', image: '/images/user-avatar-9.jpg', status: 'Offline' },
  { id: 106, name: 'Fiona Glenanne', image: '/images/user-avatar-10.jpg', status: 'Online' },
  { id: 107, name: 'George Costanza', image: '/images/user-avatar-1.jpg', status: 'Away' },
];

export function ChatList({ 
  chats, 
  selectedId, 
  onSelect, 
  onDelete, 
  onStartConversation,
  onMarkAsRead,
  onMarkAsUnread
}: ChatListProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'contacts'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const filteredContacts = ALL_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full lg:w-[400px] xl:w-[420px] shrink-0 flex flex-col ${cardClass} overflow-hidden min-h-0`}>
      {/* Tabs */}
      <div className="flex px-4 pt-2 border-b border-border shrink-0">
        <button 
          onClick={() => setActiveTab('recent')}
          className={`px-5 py-3 text-[14px] font-bold transition-all duration-200 ${
            activeTab === 'recent' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recent Chat
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`px-5 py-3 text-[14px] font-bold transition-all duration-200 ${
            activeTab === 'contacts' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Contacts
        </button>
      </div>

      {activeTab === 'contacts' && (
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9 h-9 text-[13px] bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="px-6 py-3 border-b border-border shrink-0">
           <span className="text-foreground font-medium text-[14px]">Calls</span>
        </div>
      )}

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'recent' ? (
          <>
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {
                  onSelect(chat.id);
                  onMarkAsRead(chat.id);
                }}
                className={`flex gap-3 p-[18px] border-b border-border transition-all duration-200 relative group/item cursor-pointer ${
                  selectedId === chat.id 
                    ? 'bg-primary/5' 
                    : chat.unread > 0 
                      ? 'bg-primary/[0.03]' 
                      : 'hover:bg-muted'
                }`}
              >
                {selectedId === chat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"></div>
                )}
                
                <div className="relative shrink-0">
                  <Avatar className="w-[40px] h-[40px]">
                    <AvatarImage src={chat.image} className="object-cover" />
                  </Avatar>
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {chat.unread}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h6 className={`text-foreground text-[14px] truncate ${chat.unread > 0 ? 'font-black' : 'font-bold'}`}>
                      {chat.name}
                      {chat.unread > 0 && <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 animate-pulse" />}
                    </h6>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="text-[12px] text-muted-foreground">{chat.time}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 text-muted-foreground hover:text-primary">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(chat.id);
                            }}
                          >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            <span>Mark as Read</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsUnread(chat.id);
                            }}
                          >
                            <CircleDashed className="mr-2 h-4 w-4" />
                            <span>Mark as Unread</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={(e) => handleDelete(chat.id, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}

            {chats.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No recent chats available.
              </div>
            )}
          </>
        ) : (
          <>
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => {
                  setActiveTab('recent');
                  onStartConversation(contact);
                }}
                className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="relative shrink-0">
                  <Avatar className="w-[40px] h-[40px]">
                    <AvatarImage src={contact.image} className="object-cover" />
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                    contact.status === 'Online' ? 'bg-green-500' : 
                    contact.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-foreground text-[14px] font-bold truncate">{contact.name}</h6>
                  <span className="text-[12px] text-muted-foreground">{contact.status}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-[11px] font-bold hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('recent');
                    onStartConversation(contact);
                  }}
                >
                  CHAT
                </Button>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-[13px]">
                No contacts found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
