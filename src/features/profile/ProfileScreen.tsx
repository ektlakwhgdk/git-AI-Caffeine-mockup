import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, User, Weight, Ruler, Calendar, Zap, Bell, Globe, LogOut, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const dailyLimit = 200;
  const recommendedLimit = 400; // WHO recommended limit

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
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
          
          <h1 className="text-[24px]">Profile & Settings</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/10">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-primary-foreground text-[28px]">JD</span>
              </motion.div>
              <div className="flex-1">
                <h2 className="text-[22px] mb-1">John Doe</h2>
                <p className="text-sm text-muted-foreground">johndoe@email.com</p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="mt-3 h-9 rounded-xl border-primary/20 text-sm"
                  >
                    Edit Profile
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Health Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="mb-3 text-[18px]">Health Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <Weight className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-[18px]">70 kg</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <Ruler className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="text-[18px]">175 cm</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-[18px]">28 years</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Limit</p>
                    <p className="text-[18px]">200 mg</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Caffeine Limit Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 mt-3 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Your Daily Limit vs Recommended</span>
                  </div>
                </div>
                
                {/* Visual Bar Comparison */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Your limit</span>
                    <span className="text-primary">{dailyLimit}mg</span>
                  </div>
                  <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dailyLimit / recommendedLimit) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">WHO recommended limit</span>
                    <span>{recommendedLimit}mg</span>
                  </div>
                  <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground/40 rounded-full w-full" />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  You're at {((dailyLimit / recommendedLimit) * 100).toFixed(0)}% of the recommended safe limit
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="mb-3 text-[18px]">Settings</h3>
          <Card className="divide-y divide-border/50">
            {/* Caffeine Alerts */}
            <motion.div 
              className="p-4 flex items-center justify-between"
              whileHover={{ backgroundColor: "rgba(230, 213, 195, 0.1)" }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="alerts" className="cursor-pointer">Caffeine Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when nearing limit</p>
                </div>
              </div>
              <Switch id="alerts" defaultChecked />
            </motion.div>

            {/* Language */}
            <motion.div 
              className="p-4 flex items-center justify-between cursor-pointer"
              whileHover={{ backgroundColor: "rgba(230, 213, 195, 0.1)", x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 rounded-xl p-2">
                  <Globe className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p>Language</p>
                  <p className="text-xs text-muted-foreground">English</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>

            {/* Edit Daily Limit */}
            <motion.div 
              className="p-4 flex items-center justify-between cursor-pointer"
              whileHover={{ backgroundColor: "rgba(230, 213, 195, 0.1)", x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p>Daily Caffeine Limit</p>
                  <p className="text-xs text-muted-foreground">Customize your limit</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>

            {/* Edit Profile Info */}
            <motion.div 
              className="p-4 flex items-center justify-between cursor-pointer"
              whileHover={{ backgroundColor: "rgba(230, 213, 195, 0.1)", x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-xl p-2">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p>Personal Information</p>
                  <p className="text-xs text-muted-foreground">Update your details</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="mb-3 text-[18px]">Account</h3>
          <Card>
            <motion.div whileHover={{ backgroundColor: "rgba(212, 24, 61, 0.05)" }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className="w-full h-14 rounded-xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div 
          className="text-center py-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p>AI Caffeine Advisor</p>
          <p>Version 1.0.0</p>
        </motion.div>

        <div className="h-6" />
      </div>
    </div>
  );
}
