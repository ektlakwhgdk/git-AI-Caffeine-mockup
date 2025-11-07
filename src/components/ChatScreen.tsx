import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ChevronLeft, Send, Coffee, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Friend {
  id: number;
  name: string;
  initials: string;
  caffeineLevel: number;
  avatarColor: string;
}

interface ChatScreenProps {
  friend: Friend;
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "me" | "friend";
  timestamp: string;
  type?: "info" | "warning";
}

export function ChatScreen({ friend, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `안녕! 오늘 카페인 많이 섭취했네?`,
      sender: "me",
      timestamp: "10:23"
    },
    {
      id: 2,
      text: `응, 오늘 회의가 많아서 커피를 좀 많이 마셨어 😅`,
      sender: "friend",
      timestamp: "10:24"
    },
    {
      id: 3,
      text: `현재 ${friend.caffeineLevel}mg인데 괜찮아?`,
      sender: "me",
      timestamp: "10:24"
    },
    {
      id: 4,
      text: `조금 많긴 한데... 오후엔 안 마실 예정이야`,
      sender: "friend",
      timestamp: "10:25"
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "me",
      timestamp: new Date().toLocaleTimeString("ko-KR", { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate friend reply after a delay
    setTimeout(() => {
      const replies = [
        "고마워! 주의할게 😊",
        "그러게, 조금 줄여야겠다",
        "응응 알겠어!",
        "좋은 조언 감사해 👍",
        "나도 걱정됐는데 잘됐다"
      ];
      
      const friendReply: Message = {
        id: messages.length + 2,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: "friend",
        timestamp: new Date().toLocaleTimeString("ko-KR", { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      };
      
      setMessages(prev => [...prev, friendReply]);
    }, 1500);
  };

  const getCaffeineStatus = (level: number) => {
    if (level >= 300) {
      return { 
        color: "bg-red-500", 
        label: "높음", 
        textColor: "text-red-600",
      };
    } else if (level >= 100) {
      return { 
        color: "bg-yellow-500", 
        label: "주의", 
        textColor: "text-yellow-700",
      };
    } else {
      return { 
        color: "bg-green-500", 
        label: "안전", 
        textColor: "text-green-600",
      };
    }
  };

  const status = getCaffeineStatus(friend.caffeineLevel);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onBack}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </motion.div>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-border/50">
                <div className={`w-full h-full bg-gradient-to-br ${friend.avatarColor} flex items-center justify-center`}>
                  <span className="text-white text-[16px]">{friend.initials}</span>
                </div>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${status.color} rounded-full border-2 border-background`} />
            </div>
            
            <div className="flex-1">
              <h1 className="text-[20px]">{friend.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  카페인 {friend.caffeineLevel}mg
                </span>
                <Badge className={`${status.color} text-white border-0 text-[10px] px-1.5 py-0`}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caffeine Info Banner */}
      {friend.caffeineLevel >= 300 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-4"
        >
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800">
                  <span className="">{friend.name}</span>님의 카페인 섭취량이 높습니다
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  적절한 휴식을 권장해보세요!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end space-x-2 max-w-[75%] ${message.sender === "me" ? "flex-row-reverse space-x-reverse" : ""}`}>
                {message.sender === "friend" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <div className={`w-full h-full bg-gradient-to-br ${friend.avatarColor} flex items-center justify-center`}>
                      <span className="text-white text-xs">{friend.initials}</span>
                    </div>
                  </Avatar>
                )}
                
                <div className="space-y-1">
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    message.sender === "me" 
                      ? "bg-primary text-primary-foreground rounded-br-sm" 
                      : "bg-secondary text-secondary-foreground rounded-bl-sm"
                  }`}>
                    <p className="text-[15px] leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground px-1 ${
                    message.sender === "me" ? "text-right" : "text-left"
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-6 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setInputValue("카페인 섭취 조금 줄이는 게 어때?")}
          >
            <Coffee className="w-3 h-3 mr-1" />
            카페인 줄이기 추천
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setInputValue("물 좀 마셔!")}
          >
            💧 물 마시기
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setInputValue("오늘 어때?")}
          >
            👋 인사하기
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full pr-4 h-11 bg-secondary/50 border-secondary focus:border-primary"
            />
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              className="rounded-full w-11 h-11 bg-primary hover:bg-primary/90"
              onClick={handleSend}
              disabled={inputValue.trim() === ""}
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
