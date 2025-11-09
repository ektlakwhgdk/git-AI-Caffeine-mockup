import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { CaffeineEntry, StatusType } from "@/types";
import { caffeineAPI, getToken } from "@/lib/api";

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

  // Load data from API on mount
  useEffect(() => {
    const loadCaffeineData = async () => {
      const token = getToken();
      if (!token) {
        // 로그인하지 않은 경우 로컬 데이터 사용
        const today = new Date().toDateString();
        resetDailyData(today);
        return;
      }

      try {
        // API에서 현재 카페인 정보 가져오기
        const caffeineInfo = await caffeineAPI.getCurrentInfo();
        setCurrentIntake(caffeineInfo.current_caffeine);
        
        // 오늘의 섭취 이력 가져오기
        const history = await caffeineAPI.getTodayHistory();
        const todayEntries: CaffeineEntry[] = history.map(h => ({
          id: h.history_id.toString(),
          brand: h.brand_name,
          drink: h.menu_name,
          caffeine: h.caffeine_mg,
          timestamp: new Date(h.drinked_at)
        }));
        setEntries(todayEntries);
        
        const today = new Date().toDateString();
        setLastResetDate(today);
      } catch (error) {
        console.error('Failed to load caffeine data:', error);
        const today = new Date().toDateString();
        resetDailyData(today);
      }
    };

    loadCaffeineData();
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

  const addCaffeine = async (entry: Omit<CaffeineEntry, "id" | "timestamp">) => {
    const token = getToken();
    
    if (!token) {
      // 로그인하지 않은 경우 로컬에만 저장
      const newEntry: CaffeineEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      const newIntake = currentIntake + entry.caffeine;
      setEntries((prev) => [...prev, newEntry]);
      setCurrentIntake(newIntake);
      toast.success(`${entry.drink} 추가됨`, {
        description: `+${entry.caffeine}mg 카페인`,
      });
      return;
    }

    try {
      // API를 통해 DB에 저장
      const response = await caffeineAPI.addIntake({
        brand_name: entry.brand,
        menu_name: entry.drink,
        caffeine_mg: entry.caffeine,
      });

      const newEntry: CaffeineEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date(),
      };

      const newIntake = response.caffeineInfo.current_caffeine;
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
    } catch (error) {
      console.error('Failed to add caffeine:', error);
      toast.error(error instanceof Error ? error.message : "카페인 기록 중 오류가 발생했습니다.");
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
