import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Sparkles, Coffee, TrendingDown, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useCaffeine } from "../../contexts/CaffeineContext";

interface AIChatbotScreenProps {
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChatbotScreen({ onBack }: AIChatbotScreenProps) {
  const { currentIntake, dailyLimit, remainingCaffeine, getCaffeineStatus, entries } = useCaffeine();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 저는 AI 카페인 어드바이저입니다. 카페인 섭취와 관련된 어떤 질문이든 물어보세요. 😊",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickReplies = [
    { icon: Coffee, text: "오늘 카페인 섭취량은?" },
    { icon: TrendingDown, text: "카페인 줄이는 방법" },
    { icon: Calendar, text: "최적의 카페인 타이밍" },
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const percentage = Math.round((currentIntake / dailyLimit) * 100);
    const status = getCaffeineStatus();
    
    if (lowerMessage.includes("섭취량") || lowerMessage.includes("얼마나")) {
      let statusMessage = "";
      if (status === "safe") {
        statusMessage = "아직 여유가 있으니 오후에 한 잔 더 드셔도 괜찮아요! ☕";
      } else if (status === "caution") {
        statusMessage = "적정 수준을 유지하고 있어요. 하지만 더 드실 때는 신중하게 선택하세요. 😊";
      } else {
        statusMessage = "일일 권장량에 가까워졌어요. 오늘은 더 이상 섭취를 피하는 것이 좋습니다. 🚨";
      }
      return `현재 ${currentIntake}mg의 카페인을 섭취하셨네요. 일일 권장량 ${dailyLimit}mg의 ${percentage}%입니다. ${statusMessage}`;
    } else if (lowerMessage.includes("줄이") || lowerMessage.includes("감소")) {
      return "카페인을 점진적으로 줄이는 것이 좋습니다:\n\n1. 주 단위로 10-20% 감소\n2. 디카페인 음료로 대체\n3. 물을 충분히 마시기\n4. 규칙적인 수면 패턴 유지\n\n천천히 줄이면 금단 증상을 최소화할 수 있어요! 💪";
    } else if (lowerMessage.includes("타이밍") || lowerMessage.includes("시간") || lowerMessage.includes("언제")) {
      return "최적의 카페인 섭취 시간:\n\n🌅 오전 9:30-11:30: 코르티솔 수치가 낮아 효과적\n☀️ 오후 1:00-5:00: 오후 피로 해소\n🌙 저녁 6시 이후: 피하는 것이 좋습니다\n\n카페인은 섭취 후 6시간까지 영향을 미칠 수 있어요!";
    } else if (lowerMessage.includes("추천") || lowerMessage.includes("음료")) {
      const remaining = remainingCaffeine;
      let recommendation = "";
      if (remaining >= 150) {
        recommendation = "☕ 아메리카노 (75-150mg)\n🥤 콜드브루 (150-200mg)\n🍵 녹차 (30mg)";
      } else if (remaining >= 75) {
        recommendation = "☕ 아메리카노 (75mg)\n🥤 라떼 (45-75mg)\n🍵 녹차 (30mg)";
      } else if (remaining > 0) {
        recommendation = "🥤 디카페인 라떼\n🍵 녹차 (30mg)\n🫖 허브티 (0mg)";
      } else {
        recommendation = "🥤 디카페인 음료\n🫖 허브티\n💧 물";
      }
      return `현재 남은 권장량(${remaining}mg)을 고려하면 이런 음료를 추천해요:\n\n${recommendation}\n\n어떤 음료가 마음에 드시나요?`;
    } else if (lowerMessage.includes("부작용") || lowerMessage.includes("증상")) {
      return "과다 섭취 시 이런 증상이 나타날 수 있어요:\n\n⚠️ 불안감, 떨림\n💤 불면증\n💓 심박수 증가\n🤕 두통\n\n하루 400mg 이상은 피하는 것이 좋습니다!";
    } else if (lowerMessage.includes("감사") || lowerMessage.includes("고마")) {
      return "천만에요! 언제든 카페인 관련 질문이 있으면 물어보세요. 건강한 카페인 생활을 응원합니다! 🎉";
    } else if (lowerMessage.includes("안녕") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      return "안녕하세요! 😊 카페인 섭취에 대해 궁금한 점이 있으신가요?";
    } else if (lowerMessage.includes("상태") || lowerMessage.includes("현황")) {
      return `📊 오늘의 카페인 상태:\n\n총 섭취량: ${currentIntake}mg / ${dailyLimit}mg\n남은 권장량: ${remainingCaffeine}mg\n마신 음료: ${entries.length}잔\n\n현재 상태: ${status === "safe" ? "안전 ✅" : status === "caution" ? "주의 ⚠️" : "높음 🚨"}`;
    } else {
      return "흥미로운 질문이네요! 더 구체적으로 말씀해주시면 정확한 답변을 드릴 수 있어요. 카페인 섭취량, 타이밍, 추천 음료, 현재 상태 등에 대해 물어보세요! 💡";
    }
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(messageText),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-[20px]">AI 카페인 어드바이저</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                온라인
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                } rounded-2xl px-4 py-3 shadow-sm`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <p className="text-sm text-muted-foreground mb-3">빠른 질문</p>
          <div className="flex gap-2 flex-wrap">
            {quickReplies.map((reply, index) => {
              const Icon = reply.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="rounded-full text-sm"
                    onClick={() => handleSend(reply.text)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {reply.text}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="rounded-full px-4 py-6 resize-none"
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              className="rounded-full h-12 w-12 shrink-0"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
