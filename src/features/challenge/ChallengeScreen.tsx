import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Target, Clock, TrendingDown, Coffee, CheckCircle2, Trophy, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChallengeScreenProps {
  onBack: () => void;
}

interface Challenge {
  challenge_id: number;
  title: string;
  goal: string;
  description: string;
  icon: string;
  status: "not started" | "in progress" | "completed";
  progress?: number;
  daysLeft?: number;
  reward?: string;
}

export function ChallengeScreen({ onBack }: ChallengeScreenProps) {
  const [filter, setFilter] = useState<"ongoing" | "completed">("ongoing");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      challenge_id: 1,
      title: "일일 카페인 제한 챌린지",
      goal: "하루 카페인 섭취량 400mg 이하 유지",
      description: "건강한 카페인 섭취를 위해 하루 최대 권장량인 400mg를 넘지 않도록 관리하세요. 성인의 경우 하루 400mg 이하가 안전한 수준입니다.",
      icon: "☕",
      status: "in progress",
      progress: 65,
      daysLeft: 5,
      reward: "건강 마스터 배지 🏆"
    },
    {
      challenge_id: 2,
      title: "카페인 50% 감량 챌린지",
      goal: "평균 카페인 섭취량 50% 감소",
      description: "지난 주 평균 카페인 섭취량 대비 50%를 줄여보세요. 점진적인 감소로 건강한 습관을 만들어갑니다.",
      icon: "📉",
      status: "not started",
      reward: "감량 챔피언 배지 🎖️"
    },
    {
      challenge_id: 3,
      title: "오후 5시 이후 제로 카페인",
      goal: "오후 5시 이후 카페인 섭취 금지",
      description: "좋은 수면을 위해 오후 5시 이후에는 카페인 음료를 피하세요. 카페인의 반감기는 약 5-6시간입니다.",
      icon: "🌙",
      status: "in progress",
      progress: 40,
      daysLeft: 9,
      reward: "수면 수호자 배지 😴"
    },
    {
      challenge_id: 4,
      title: "디카페인 전환 챌린지",
      goal: "매일 최소 1잔의 디카페인 음료",
      description: "하루에 최소 한 잔은 디카페인 음료로 대체하세요. 맛은 유지하면서 카페인은 줄일 수 있습니다.",
      icon: "🍵",
      status: "completed",
      progress: 100,
      reward: "디카페인 마스터 배지 ✨"
    },
    {
      challenge_id: 5,
      title: "주말 카페인 프리 챌린지",
      goal: "주말 동안 완전한 카페인 제로",
      description: "주말 이틀 동안 카페인 없이 지내보세요. 몸의 카페인 의존도를 낮추는 데 도움이 됩니다.",
      icon: "🎯",
      status: "not started",
      reward: "주말 워리어 배지 🏅"
    }
  ]);

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === "ongoing") {
      return challenge.status === "in progress" || challenge.status === "not started";
    }
    return challenge.status === "completed";
  });

  const handleJoinChallenge = (challengeId: number) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.challenge_id === challengeId
          ? { ...challenge, status: "in progress" as const, progress: 0, daysLeft: 14 }
          : challenge
      )
    );
    setSelectedChallenge(null);
  };

  const getStatusColor = (status: Challenge["status"]) => {
    switch (status) {
      case "in progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: Challenge["status"]) => {
    switch (status) {
      case "in progress":
        return "진행중";
      case "completed":
        return "완료";
      default:
        return "시작 전";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
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
          
          <h1 className="text-[24px]">카페인 챌린지</h1>
          
          <div className="w-10" />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={filter === "ongoing" ? "default" : "outline"}
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => setFilter("ongoing")}
          >
            <Trophy className="w-4 h-4 mr-1" />
            진행중
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => setFilter("completed")}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            완료됨
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-4">
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-[28px] text-primary">
                {challenges.filter(c => c.status === "in progress").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">진행중</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-[28px] text-green-600">
                {challenges.filter(c => c.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">완료</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-[28px]">
                {challenges.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">전체</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Challenge List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        <AnimatePresence mode="wait">
          {filteredChallenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {filter === "completed" ? "아직 완료한 챌린지가 없습니다" : "진행중인 챌린지가 없습니다"}
              </p>
            </motion.div>
          ) : (
            filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.challenge_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <Card className="p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="text-[32px] flex-shrink-0">
                        {challenge.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 pr-2">
                            <h3 className="text-[16px] mb-1">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {challenge.goal}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(challenge.status)} text-white border-0 text-xs px-2 py-0.5 flex-shrink-0`}>
                            {getStatusText(challenge.status)}
                          </Badge>
                        </div>

                        {/* Progress Bar (for in progress challenges) */}
                        {challenge.status === "in progress" && challenge.progress !== undefined && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">진행률</span>
                              <span className="text-primary">{challenge.progress}%</span>
                            </div>
                            <Progress value={challenge.progress} className="h-2" />
                            {challenge.daysLeft && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{challenge.daysLeft}일 남음</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Completed Badge */}
                        {challenge.status === "completed" && (
                          <div className="mt-3 flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">획득: {challenge.reward}</span>
                          </div>
                        )}

                        {/* Not Started Button */}
                        {challenge.status === "not started" && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              className="w-full rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChallenge(challenge);
                              }}
                            >
                              챌린지 참여
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Challenge Detail Modal */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-xl">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-[40px]">{selectedChallenge?.icon}</span>
              <div className="flex-1">
                <DialogTitle className="text-[20px]">{selectedChallenge?.title}</DialogTitle>
                <Badge className={`${getStatusColor(selectedChallenge?.status || "not started")} text-white border-0 text-xs mt-1`}>
                  {getStatusText(selectedChallenge?.status || "not started")}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Goal */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary" />
                <h4 className="text-sm">목표</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {selectedChallenge?.goal}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-primary" />
                <h4 className="text-sm">설명</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {selectedChallenge?.description}
              </p>
            </div>

            {/* Reward */}
            {selectedChallenge?.reward && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h4 className="text-sm">보상</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {selectedChallenge.reward}
                </p>
              </div>
            )}

            {/* Progress (if in progress) */}
            {selectedChallenge?.status === "in progress" && selectedChallenge.progress !== undefined && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>현재 진행률</span>
                  <span className="text-primary">{selectedChallenge.progress}%</span>
                </div>
                <Progress value={selectedChallenge.progress} className="h-2" />
                {selectedChallenge.daysLeft && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>남은 기간: {selectedChallenge.daysLeft}일</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedChallenge?.status === "not started" && (
              <Button
                className="w-full rounded-full"
                onClick={() => selectedChallenge && handleJoinChallenge(selectedChallenge.challenge_id)}
              >
                <Trophy className="w-4 h-4 mr-2" />
                챌린지 시작하기
              </Button>
            )}
            {selectedChallenge?.status === "in progress" && (
              <Button variant="outline" className="w-full rounded-full" onClick={() => setSelectedChallenge(null)}>
                계속 진행하기
              </Button>
            )}
            {selectedChallenge?.status === "completed" && (
              <Button variant="outline" className="w-full rounded-full" onClick={() => setSelectedChallenge(null)}>
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
