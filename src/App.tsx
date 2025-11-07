import { useState, useEffect } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { AIChatbotScreen } from "./components/AIChatbotScreen";
import { TrackingScreen } from "./components/TrackingScreen";
import { FriendsScreen, type Friend } from "./components/FriendsScreen";
import { ChatScreen } from "./components/ChatScreen";
import { ChallengeScreen } from "./components/ChallengeScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { CaffeineAlert } from "./components/CaffeineAlert";
import { CaffeineProvider } from "./contexts/CaffeineContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeScreen, setActiveScreen] = useState("home");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleGetStarted = () => {
    setHasOnboarded(true);
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleBackToHome = () => {
    setActiveScreen("home");
  };

  const handleBackToFriends = () => {
    setActiveScreen("friends");
    setSelectedFriend(null);
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setActiveScreen("chat");
  };

  const handleLogout = () => {
    setHasOnboarded(false);
    setActiveScreen("home");
  };

  if (!hasOnboarded) {
    return (
      <div className="h-screen max-w-md mx-auto bg-background">
        <OnboardingScreen onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <CaffeineProvider>
      <div className="h-screen max-w-md mx-auto bg-background flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden pb-20">
          {activeScreen === "home" && <DashboardScreen onNavigate={handleNavigate} />}
          {activeScreen === "aichat" && <AIChatbotScreen onBack={handleBackToHome} />}
          {activeScreen === "tracking" && <TrackingScreen onBack={handleBackToHome} />}
          {activeScreen === "friends" && <FriendsScreen onBack={handleBackToHome} onFriendClick={handleFriendClick} />}
          {activeScreen === "chat" && selectedFriend && <ChatScreen friend={selectedFriend} onBack={handleBackToFriends} />}
          {activeScreen === "challenge" && <ChallengeScreen onBack={handleBackToHome} />}
          {activeScreen === "profile" && <ProfileScreen onBack={handleBackToHome} onLogout={handleLogout} />}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeScreen} onNavigate={handleNavigate} />
        
        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </CaffeineProvider>
  );
}
