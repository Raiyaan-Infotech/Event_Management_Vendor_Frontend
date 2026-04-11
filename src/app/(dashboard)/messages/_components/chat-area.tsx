import React, { useState } from "react";
import {
  UserPlus,
  Paperclip,
  Send,
  MessageSquare,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeImage } from "@/components/ui/safe-image";

const cardClass =
  "bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none ";

interface Message {
  id: number;
  type: "received" | "sent";
  content: string;
  avatar?: string;
  name?: string;
  time: string;
  isFirstInGroup: boolean;
  images?: string[];
}

const MOCK_CHATS_HISTORY: Record<
  number,
  { date: string; messages: Message[] }
> = {
  1: {
    date: "14 AUG 2019",
    messages: [
      {
        id: 101,
        type: "received",
        content: "Hello! I need to discuss the upcoming event details.",
        avatar: "/images/user-avatar-1.jpg",
        time: "11:15 am",
        isFirstInGroup: true,
      },
      {
        id: 102,
        type: "sent",
        content: "Hi Socrates! Sure, I am available to talk now.",
        avatar: "/images/user-avatar-1.jpg",
        time: "11:20 am",
        isFirstInGroup: true,
      },
      {
        id: 103,
        type: "received",
        content: "Great. Let me send you the updated guest list.",
        avatar: "/images/user-avatar-1.jpg",
        time: "11:25 am",
        isFirstInGroup: true,
      },
    ],
  },
  2: {
    date: "13 AUG 2019",
    messages: [
      {
        id: 201,
        type: "received",
        content: "The payment for the last project has been processed.",
        avatar: "/images/user-avatar-2.jpg",
        time: "09:00 am",
        isFirstInGroup: true,
      },
      {
        id: 202,
        type: "sent",
        content: "Thank you Dexter. I received the confirmation email.",
        avatar: "/images/user-avatar-1.jpg",
        time: "09:15 am",
        isFirstInGroup: true,
      },
    ],
  },
  3: {
    date: "12 AUG 2019",
    messages: [
      {
        id: 1,
        type: "sent",
        content:
          "Nulla consequat massa quis enim. Donec pede justo, fringilla vel...",
        avatar: "/images/user-avatar-1.jpg",
        time: "9:48 am",
        isFirstInGroup: true,
      },
      {
        id: 2,
        type: "sent",
        content: "rhoncus ut, imperdiet a, venenatis vitae, justo...",
        time: "9:48 am",
        isFirstInGroup: false,
      },
      {
        id: 3,
        type: "received",
        content:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
        avatar: "/images/user-avatar-3.jpg",
        time: "9:32 am",
        isFirstInGroup: true,
      },
      {
        id: 4,
        type: "sent",
        content:
          "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
        avatar: "/images/user-avatar-1.jpg",
        time: "9:48 am",
        isFirstInGroup: true,
      },
      {
        id: 5,
        type: "sent",
        content: "Nullam dictum felis eu pede mollis pretium",
        time: "9:48 am",
        isFirstInGroup: false,
      },
      {
        id: 6,
        type: "received",
        content: "Maecenas tempus, tellus eget condimentum rhoncus",
        avatar: "/images/user-avatar-3.jpg",
        time: "10:12 am",
        images: [
          "/images/corporate-event-600.jpg",
          "/images/wedding-event-600.jpg",
          "/images/birthday-party-600.jpg",
        ],
        isFirstInGroup: true,
      },
      {
        id: 7,
        type: "sent",
        content: "Maecenas tempus, tellus eget condimentum rhoncus",
        avatar: "/images/user-avatar-1.jpg",
        time: "09:40 am",
        isFirstInGroup: true,
      },
      {
        id: 8,
        type: "sent",
        content:
          "Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.",
        time: "09:40 am",
        isFirstInGroup: false,
      },
    ],
  },
  4: {
    date: "11 AUG 2019",
    messages: [
      {
        id: 401,
        type: "received",
        content: "Are we still on for the venue visit tomorrow?",
        avatar: "/images/user-avatar-4.jpg",
        time: "Yesterday",
        isFirstInGroup: true,
      },
      {
        id: 402,
        type: "sent",
        content: "Yes Joyce, seeing you there at 10 am.",
        avatar: "/images/user-avatar-1.jpg",
        time: "Yesterday",
        isFirstInGroup: true,
      },
    ],
  },
};

interface ChatAreaProps {
  selectedChat: {
    id: number;
    name: string;
    image: string;
  } | null;
}

export function ChatArea({ selectedChat }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentDate, setCurrentDate] = useState("14 AUG 2019");

  // Update messages when selectedChat changes
  React.useEffect(() => {
    if (selectedChat && MOCK_CHATS_HISTORY[selectedChat.id]) {
      setMessages(MOCK_CHATS_HISTORY[selectedChat.id].messages);
      setCurrentDate(MOCK_CHATS_HISTORY[selectedChat.id].date);
    } else {
      setMessages([]);
      setCurrentDate(
        new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toUpperCase(),
      );
    }
    setInputText("");
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;
    const newMessage = {
      id: Date.now(),
      type: "sent" as const,
      content: inputText,
      avatar: "/images/user-avatar-1.jpg",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFirstInGroup: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  if (!selectedChat) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center ${cardClass} bg-card/50 backdrop-blur-sm p-6 text-center`}
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-foreground text-[18px] font-bold mb-1 uppercase tracking-tight">
          Select a Chat
        </h3>
        <p className="text-muted-foreground text-[14px] max-w-[280px]">
          Choose a conversation from the list to start messaging with your
          clients.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${cardClass} overflow-hidden min-w-0 min-h-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-[40px] h-[40px]">
            <AvatarImage src={selectedChat.image} className="object-cover" />
            <AvatarFallback>{selectedChat.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h5 className="text-foreground text-[15px] font-bold leading-tight">
              {selectedChat.name}
            </h5>
            <span className="text-muted-foreground text-[12px]">
              Last seen: 2 minutes ago
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-primary transition-colors">
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 bg-card p-6 overflow-y-auto space-y-4 flex flex-col min-h-0">
        <div className="text-center font-bold text-[11px] text-muted-foreground uppercase tracking-[1px] mb-4">
          {currentDate}
        </div>

        {messages.map((msg) => {
          const isSent = msg.type === "sent";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSent ? "items-end" : "items-start"} gap-1 max-w-full group`}
            >
              <div
                className={`flex ${isSent ? "justify-end" : "justify-start"} items-center gap-3 w-full`}
              >
                {!isSent && msg.isFirstInGroup && (
                  <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
                    <AvatarImage src={msg.avatar} className="object-cover" />
                    <AvatarFallback>{msg.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                )}
                {!isSent && !msg.isFirstInGroup && (
                  <div className="w-[36px] shrink-0"></div>
                )}

                <div className="flex flex-col gap-2 max-w-[70%]">
                  <div
                    className={`p-[14px_18px] rounded-[5px] text-[13.5px] leading-relaxed ${
                      isSent
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.images && (
                    <div className="flex gap-2 flex-wrap">
                      {msg.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="w-[90px] h-[65px] rounded-[5px] overflow-hidden"
                        >
                          <SafeImage
                            src={img}
                            width={90}
                            height={65}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                            alt="attachment"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isSent && msg.isFirstInGroup && (
                  <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
                    <AvatarImage src={msg.avatar} className="object-cover" />
                    <AvatarFallback>{msg.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                )}
                {isSent && !msg.isFirstInGroup && (
                  <div className="w-[36px] shrink-0"></div>
                )}
              </div>
              {msg.isFirstInGroup && (
                <span
                  className={`text-muted-foreground text-[11px] ${isSent ? "pr-[48px] text-right" : "pl-[48px] text-left"} pt-1 font-medium w-full tracking-wide`}
                >
                  {msg.time}
                </span>
              )}
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Footer (Input) */}
      <div className="p-4 border-t border-border bg-card shrink-0 flex items-center gap-3">
        <div className="flex items-center gap-1 mr-1">
          <button
            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted"
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-transparent text-[14px] text-foreground placeholder-[#a8b1c7] focus:outline-none"
        />
        <button className="text-muted-foreground hover:text-primary transition-colors p-2">
          <Paperclip size={18} />
        </button>
        <button
          className="text-primary hover:brightness-110 transition-colors p-2"
          onClick={handleSendMessage}
        >
          <Send size={20} className="fill-current -rotate-45 -mt-1 ml-1" />
        </button>
      </div>
    </div>
  );
}
