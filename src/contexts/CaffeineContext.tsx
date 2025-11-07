import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { CaffeineEntry, StatusType } from "@/types";

interface CaffeineContextType {
  currentIntake: number;
  dailyLimit: number;
  entries: CaffeineEntry[];
  addCaffeine: (entry: Omit<CaffeineEntry, "id" | "timestamp">) => void;
  getCaffeineStatus: () => StatusType;
  remainingCaffeine: number;
  hasShownHighAlert: boolean;
}

const CaffeineContext = createContext<CaffeineContextType | undefined>(undefined);

const DAILY_LIMIT = 400; // mg
const STORAGE_KEY = "caffeine_tracker_data";
const ALERT_SHOWN_KEY = "caffeine_alert_shown";

export function CaffeineProvider({ children }: { children: ReactNode }) {
  const [currentIntake, setCurrentIntake] = useState(0);
  const [entries, setEntries] = useState<CaffeineEntry[]>([]);
  const [hasShownHighAlert, setHasShownHighAlert] = useState(false);
  const [lastResetDate, setLastResetDate] = useState<string>("");

  // Load data from localStorage on mount
  useEffect(() => {
    const today = new Date().toDateString();
    
    // Force reset to 0 - clear all data
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ALERT_SHOWN_KEY);
    resetDailyData(today);
  }, []);

  // Auto-reset at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const today = new Date().toDateString();
      if (lastResetDate && lastResetDate !== today) {
        resetDailyData(today);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkMidnight);
  }, [lastResetDate]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const today = new Date().toDateString();
    const dataToSave = {
      date: today,
      currentIntake,
      entries,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [currentIntake, entries]);

  const resetDailyData = (date: string) => {
    setCurrentIntake(0);
    setEntries([]);
    setLastResetDate(date);
    setHasShownHighAlert(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date, currentIntake: 0, entries: [] }));
    localStorage.setItem(ALERT_SHOWN_KEY, JSON.stringify({ date, shown: false }));
  };

  const getCaffeineStatus = (): "safe" | "caution" | "high" => {
    if (currentIntake >= 300) return "high";
    if (currentIntake >= 100) return "caution";
    return "safe";
  };

  const addCaffeine = (entry: Omit<CaffeineEntry, "id" | "timestamp">) => {
    const newEntry: CaffeineEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const newIntake = currentIntake + entry.caffeine;
    const previousStatus = getCaffeineStatus();

    setEntries((prev) => [...prev, newEntry]);
    setCurrentIntake(newIntake);

    // Show success toast
    toast.success(`${entry.drink} 추가됨`, {
      description: `+${entry.caffeine}mg 카페인`,
    });

    // Check if we need to show high alert
    if (newIntake >= 300 && !hasShownHighAlert && previousStatus !== "high") {
      setHasShownHighAlert(true);
      const today = new Date().toDateString();
      localStorage.setItem(ALERT_SHOWN_KEY, JSON.stringify({ date: today, shown: true }));
      
      // Trigger high caffeine alert
      setTimeout(() => {
        toast.warning("카페인 섭취 주의", {
          description: "일일 권장량에 근접했습니다. 섭취를 모니터링 해주세요.",
          duration: 5000,
        });
      }, 500);
    } else if (newIntake >= DAILY_LIMIT) {
      // Show exceeded alert
      toast.error("일일 권장량 초과", {
        description: "카페인 일일 권장량(400mg)을 초과했습니다.",
        duration: 5000,
      });
    }
  };

  const remainingCaffeine = Math.max(0, DAILY_LIMIT - currentIntake);

  return (
    <CaffeineContext.Provider
      value={{
        currentIntake,
        dailyLimit: DAILY_LIMIT,
        entries,
        addCaffeine,
        getCaffeineStatus,
        remainingCaffeine,
        hasShownHighAlert,
      }}
    >
      {children}
    </CaffeineContext.Provider>
  );
}

export function useCaffeine() {
  const context = useContext(CaffeineContext);
  if (context === undefined) {
    throw new Error("useCaffeine must be used within a CaffeineProvider");
  }
  return context;
}
