import { motion } from "motion/react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Coffee, Plus, TrendingDown } from "lucide-react";
import { useCaffeine } from "@/contexts/CaffeineContext";

interface TrackingScreenProps {
  onBack: () => void;
}

export function TrackingScreen({ onBack }: TrackingScreenProps) {
  const { currentIntake, remainingCaffeine, addCaffeine } = useCaffeine();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("");
  const [selectedDrinkName, setSelectedDrinkName] = useState("");
  const [caffeineAmount, setCaffeineAmount] = useState("");

  const brands = [
    { value: "starbucks", label: "Starbucks", emoji: "⭐" },
    { value: "mega", label: "Mega Coffee", emoji: "☕" },
    { value: "compose", label: "Compose Coffee", emoji: "🎵" },
    { value: "ediya", label: "Ediya Coffee", emoji: "🌿" },
    { value: "other", label: "Other", emoji: "➕" }
  ];

  const drinks = {
    starbucks: [
      { value: "americano", label: "Americano", caffeine: "75" },
      { value: "latte", label: "Caffe Latte", caffeine: "75" },
      { value: "cappuccino", label: "Cappuccino", caffeine: "75" },
      { value: "espresso", label: "Espresso", caffeine: "150" },
      { value: "cold-brew", label: "Cold Brew", caffeine: "200" }
    ],
    mega: [
      { value: "americano", label: "Americano", caffeine: "150" },
      { value: "latte", label: "Mega Latte", caffeine: "45" },
      { value: "vanilla", label: "Vanilla Latte", caffeine: "45" }
    ],
    compose: [
      { value: "americano", label: "Americano", caffeine: "126" },
      { value: "latte", label: "Caffe Latte", caffeine: "75" },
      { value: "einspanner", label: "Einspanner", caffeine: "90" }
    ],
    ediya: [
      { value: "americano", label: "Americano", caffeine: "150" },
      { value: "latte", label: "Caffe Latte", caffeine: "150" },
      { value: "mocha", label: "Caffe Mocha", caffeine: "120" }
    ],
    other: []
  };

  const handleDrinkSelect = (value: string) => {
    setSelectedDrink(value);
    const brandDrinks = drinks[selectedBrand as keyof typeof drinks] || [];
    const drink = brandDrinks.find(d => d.value === value);
    if (drink) {
      setCaffeineAmount(drink.caffeine);
      setSelectedDrinkName(drink.label);
    }
  };

  const handleAddCaffeine = () => {
    if (!caffeineAmount || !selectedBrand) return;

    const brandName = brands.find(b => b.value === selectedBrand)?.label || "Unknown";
    const drinkName = selectedDrinkName || "Custom Drink";

    addCaffeine({
      brand: brandName,
      drink: drinkName,
      caffeine: parseInt(caffeineAmount),
    });

    // Reset form
    setSelectedBrand("");
    setSelectedDrink("");
    setSelectedDrinkName("");
    setCaffeineAmount("");

    // Go back to home after a short delay
    setTimeout(() => {
      onBack();
    }, 1000);
  };

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
          
          <h1 className="text-[24px]">음료 추가</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Remaining Limit Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">남은 일일 권장량</p>
                <div className="flex items-baseline space-x-2">
                  <motion.span 
                    className="text-[32px] text-primary leading-none"
                    key={remainingCaffeine}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {remainingCaffeine}
                  </motion.span>
                  <span className="text-muted-foreground">mg</span>
                </div>
              </div>
              <div className="bg-primary/10 rounded-full p-3">
                <TrendingDown className="w-8 h-8 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label htmlFor="brand">브랜드 선택</Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger id="brand" className="h-12 rounded-xl bg-card">
                <SelectValue placeholder="커피 브랜드를 선택하세요..." />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.value} value={brand.value}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{brand.emoji}</span>
                      <span>{brand.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBrand && selectedBrand !== "other" && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <Label htmlFor="drink">음료 선택</Label>
              <Select value={selectedDrink} onValueChange={handleDrinkSelect}>
                <SelectTrigger id="drink" className="h-12 rounded-xl bg-card">
                  <SelectValue placeholder="음료를 선택하세요..." />
                </SelectTrigger>
                <SelectContent>
                  {(drinks[selectedBrand as keyof typeof drinks] || []).map((drink) => (
                    <SelectItem key={drink.value} value={drink.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{drink.label}</span>
                        <span className="text-xs text-muted-foreground ml-4">{drink.caffeine}mg</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Label htmlFor="caffeine">카페인 양 (mg)</Label>
            <Input
              id="caffeine"
              type="number"
              value={caffeineAmount}
              onChange={(e) => setCaffeineAmount(e.target.value)}
              placeholder="카페인 양을 입력하세요..."
              className="h-12 rounded-xl bg-card"
            />
            <p className="text-xs text-muted-foreground">
              선택한 음료에 따라 자동으로 입력됩니다. 수동으로 조정할 수 있습니다.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label htmlFor="time">시간 (선택사항)</Label>
            <Input
              id="time"
              type="time"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              className="h-12 rounded-xl bg-card"
            />
          </motion.div>
        </motion.div>

        {/* Preview Card */}
        {caffeineAmount && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="p-4 bg-card border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-primary" />
                  <span>음료 추가 후</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-secondary/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">총 섭취량</p>
                  <motion.p 
                    className="text-[24px] text-primary"
                    key={currentIntake + parseInt(caffeineAmount || "0")}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {currentIntake + parseInt(caffeineAmount || "0")}
                    <span className="text-sm text-muted-foreground">mg</span>
                  </motion.p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">남은 양</p>
                  <motion.p 
                    className="text-[24px] text-foreground"
                    key={Math.max(0, remainingCaffeine - parseInt(caffeineAmount || "0"))}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {Math.max(0, remainingCaffeine - parseInt(caffeineAmount || "0"))}
                    <span className="text-sm text-muted-foreground">mg</span>
                  </motion.p>
                </div>
              </div>

              {(currentIntake + parseInt(caffeineAmount || "0")) >= 300 && (currentIntake + parseInt(caffeineAmount || "0")) < 400 && (
                <motion.div 
                  className="mt-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    ⚠️ 일일 권장량에 근접하고 있습니다. 섭취를 모니터링 해주세요.
                  </p>
                </motion.div>
              )}

              {(currentIntake + parseInt(caffeineAmount || "0")) >= 400 && (
                <motion.div 
                  className="mt-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-destructive">
                    🚨 일일 권장량(400mg)을 초과합니다. 더 작은 사이즈나 디카페인 옵션을 고려해보세요.
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90"
            disabled={!caffeineAmount || !selectedBrand}
            onClick={handleAddCaffeine}
          >
            <Plus className="w-5 h-5 mr-2" />
            오늘의 섭취량에 추가
          </Button>
        </motion.div>

        <div className="h-6" />
      </div>
    </div>
  );
}