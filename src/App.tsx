import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { XpToast } from './components/ui/XpToast';
import { AchievementToast } from './components/ui/AchievementToast';
import { DashboardPage } from './pages/DashboardPage';
import { ModulePage } from './pages/ModulePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { GamesPage } from './pages/GamesPage';
import { MentorPage } from './pages/MentorPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfileGate } from './pages/ProfileGate';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { useProfiles } from './hooks/useProfiles';

export default function App() {
  const { profiles, activeProfile, createProfile, switchToProfile, logout, deleteProfile, avatarOptions } = useProfiles();

  if (!activeProfile) {
    return (
      <ProfileGate
        profiles={profiles}
        avatarOptions={avatarOptions}
        onCreateProfile={createProfile}
        onSwitchToProfile={switchToProfile}
        onDeleteProfile={deleteProfile}
      />
    );
  }

  return <AuthenticatedApp profileId={activeProfile.id} profileName={activeProfile.name} profileEmoji={activeProfile.avatarEmoji} onLogout={logout} />;
}

interface AuthenticatedAppProps {
  profileId: string;
  profileName: string;
  profileEmoji: string;
  onLogout: () => void;
}

function AuthenticatedApp({ profileId, profileName, profileEmoji, onLogout }: AuthenticatedAppProps) {
  const {
    progress,
    toggleChecklistItem,
    markExerciseResult,
    recordGameScore,
    setCurrentModule,
    resetProgress,
    overallPercent,
    lastXpGain,
    newAchievement,
    clearNewAchievement,
  } = useProgress(profileId);
  const { settings, setApiKey, clearApiKey } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar
        progress={progress}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profileName={profileName}
        profileEmoji={profileEmoji}
        onLogout={onLogout}
      />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Topbar progress={progress} overallPercent={overallPercent} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage progress={progress} overallPercent={overallPercent} />} />
            <Route
              path="/modulo/:moduleId"
              element={
                <ModulePage
                  progress={progress}
                  onToggleChecklist={toggleChecklistItem}
                  onExerciseResult={markExerciseResult}
                  onGameComplete={recordGameScore}
                  onSetCurrentModule={setCurrentModule}
                />
              }
            />
            <Route path="/conquistas" element={<AchievementsPage progress={progress} />} />
            <Route path="/jogos" element={<GamesPage progress={progress} onGameComplete={recordGameScore} />} />
            <Route
              path="/mentor"
              element={<MentorPage apiKey={settings.deepseekApiKey} currentModuleId={progress.currentModuleId} />}
            />
            <Route
              path="/configuracoes"
              element={
                <SettingsPage
                  apiKey={settings.deepseekApiKey}
                  onSetApiKey={setApiKey}
                  onClearApiKey={clearApiKey}
                  onResetProgress={resetProgress}
                />
              }
            />
          </Routes>
        </main>
      </div>

      <XpToast event={lastXpGain} />
      <AchievementToast achievementId={newAchievement} onDismiss={clearNewAchievement} />
    </div>
  );
}
