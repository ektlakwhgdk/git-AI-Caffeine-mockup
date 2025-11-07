import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Coffee, Sparkles, Plus, TrendingUp, Clock, Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { CaffeineHalfLifeCurve } from "../features/caffeine/CaffeineHalfLifeCurve";
import { useCaffeine } from "../contexts/CaffeineContext";
import { Badge } from "../components/ui/badge";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { currentIntake, dailyLimit, getCaffeineStatus, remainingCaffeine, entries } = useCaffeine();
  const percentage = (currentIntake / dailyLimit) * 100;
  const status = getCaffeineStatus();

  const statusConfig = {
    safe: {
      icon: Shield,
      label: "안전",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    caution: {
      icon: AlertTriangle,
      label: "주의",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    high: {
      icon: AlertCircle,
      label: "높음",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[24px]">오늘의 섭취량</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onNavigate('profile')}
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-primary-foreground text-sm">홍길동</span>
            </motion.div>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">10월 27일 월요일</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Caffeine Progress Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-48 h-48">
                {/* Background Circle */}
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/30"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    className="text-primary"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                
                {/* Center Content */}
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Coffee className="w-8 h-8 text-primary mb-2" />
                  <motion.div 
                    className="text-[36px] leading-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {currentIntake}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">mg 카페인</div>
                </motion.div>
              </div>
              
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bgColor} border ${currentStatus.borderColor}`}>
                  <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
                  <span className={`text-sm ${currentStatus.color}`}>{currentStatus.label}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  일일 권장량의 <span className="text-primary">{Math.round(percentage)}%</span> 섭취했어요
                </p>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground">{remainingCaffeine}mg</span> 남음
                </p>
              </div>

              {/* Half-life Curve */}
              <div className="w-full mt-4 pt-4 border-t border-border/30">
                <CaffeineHalfLifeCurve currentAmount={currentIntake} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-4 bg-card hover:bg-secondary/20 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-xl p-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">오늘 마신 음료</div>
                  <div className="text-[20px]">{entries.length}</div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-4 bg-card hover:bg-secondary/20 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 rounded-xl p-2">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">마지막 음료</div>
                  <div className="text-[20px]">
                    {entries.length > 0 
                      ? (() => {
                          const lastEntry = entries[entries.length - 1];
                          const now = new Date();
                          const diff = now.getTime() - new Date(lastEntry.timestamp).getTime();
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          if (hours > 0) return `${hours}시간 전`;
                          if (minutes > 0) return `${minutes}분 전`;
                          return "방금";
                        })()
                      : "-"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="mb-3 text-[18px]">최근 활동</h3>
          {entries.length > 0 ? (
            <div className="space-y-2">
              {entries.slice().reverse().slice(0, 5).map((entry, index) => (
                <motion.div 
                  key={entry.id}
                  whileHover={{ x: 4 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 rounded-xl p-2">
                          <Coffee className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p>{entry.drink}</p>
                          <p className="text-xs text-muted-foreground">{entry.brand} • {entry.caffeine}mg</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-6 bg-card text-center">
              <Coffee className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">아직 추가된 음료가 없습니다</p>
              <p className="text-xs text-muted-foreground mt-1">음료를 추가해보세요!</p>
            </Card>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="grid grid-cols-2 gap-3 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              className="h-14 rounded-2xl bg-primary hover:bg-primary/90 flex items-center gap-2 w-full"
              onClick={() => onNavigate('tracking')}
            >
              <Plus className="w-5 h-5" />
              음료 추가
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              variant="outline"
              className="h-14 rounded-2xl border-2 border-primary/20 bg-card hover:bg-secondary/30 flex items-center gap-2 w-full"
              onClick={() => onNavigate('recommendations')}
            >
              <Sparkles className="w-5 h-5" />
              AI 추천
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* AI Coach Badge */}
      <motion.div 
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          y: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
