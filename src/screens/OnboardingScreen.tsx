import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OnboardingScreen({ onGetStarted }: { onGetStarted: () => void }) {
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    id: "",
    password: "",
    name: ""
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup:", signupForm);
    setShowSignup(false);
    onGetStarted();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-background to-secondary/20">
      {/* Logo and Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <motion.div 
          className="relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
          <motion.div 
            className="relative bg-primary rounded-full p-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Coffee className="w-16 h-16 text-primary-foreground" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="space-y-3 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-[28px] leading-tight">AI 카페인 어드바이저</h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            일일 카페인 섭취량을 모니터링하고 AI 기반 맞춤 음료와 디저트 페어링 추천을 받아보세요
          </p>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <motion.div 
        className="w-full space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90"
            onClick={onGetStarted}
          >
            이메일로 계속하기
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-2 border-primary/20 bg-card hover:bg-secondary/30"
            onClick={() => setShowSignup(true)}
          >
            회원가입
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl text-muted-foreground hover:bg-secondary/30"
            onClick={onGetStarted}
          >
            게스트로 로그인
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-64 opacity-5 pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-32 right-16 w-32 h-32 rounded-full bg-accent"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-20 right-32 w-16 h-16 rounded-full bg-primary"
          animate={{ y: [0, 25, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Signup Dialog */}
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="max-w-[90%] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center">회원가입</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              AI 카페인 어드바이저에 가입하여 맞춤형 추천을 받아보세요
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSignup} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-id">아이디</Label>
              <Input
                id="signup-id"
                type="text"
                placeholder="아이디를 입력하세요"
                className="h-12 rounded-xl"
                value={signupForm.id}
                onChange={(e) => setSignupForm({ ...signupForm, id: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">비밀번호</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="h-12 rounded-xl"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-name">이름</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="이름을 입력하세요"
                className="h-12 rounded-xl"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 mt-6"
            >
              가입하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
