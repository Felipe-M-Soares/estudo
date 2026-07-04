import { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { BottomNav } from './components/layout/BottomNav';
import { XpToast } from './components/ui/XpToast';
import { AchievementToast } from './components/ui/AchievementToast';
import { PageLoader } from './components/ui/PageLoader';
import { DashboardPage } from './pages/DashboardPage';
import { ProfileGate } from './pages/ProfileGate';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { useProfiles } from './hooks/useProfiles';
import { useDesignTheme } from './hooks/useDesignTheme';

// Páginas pesadas (jogos, diagramas, editor de código) só carregam quando acessadas
const ModulePage = lazy(() => import('./pages/ModulePage').then((m) => ({ default: m.ModulePage })));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })));
const GamesPage = lazy(() => import('./pages/GamesPage').then((m) => ({ default: m.GamesPage })));
const MentorPage = lazy(() => import('./pages/MentorPage').then((m) => ({ default: m.MentorPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const InterviewModePage = lazy(() => import('./pages/InterviewModePage').then((m) => ({ default: m.InterviewModePage })));
const LabPage = lazy(() => import('./pages/LabPage').then((m) => ({ default: m.LabPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then((m) => ({ default: m.AcademyPage })));

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
    markReviewDone,
    saveProjectNote,
    importProgress,
    addInterviewResult,
    overallPercent,
    lastXpGain,
    newAchievement,
    clearNewAchievement,
  } = useProgress(profileId);
  const { settings, setApiKey, clearApiKey } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useDesignTheme();

  return (
    <div className="app-shell flex min-h-screen">
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

        <main className="flex-1 pb-20 lg:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage progress={progress} overallPercent={overallPercent} onReviewResult={markReviewDone} />} />
              <Route
                path="/modulo/:moduleId"
                element={
                  <ModulePage
                    progress={progress}
                    onToggleChecklist={toggleChecklistItem}
                    onExerciseResult={markExerciseResult}
                    onGameComplete={recordGameScore}
                    onSetCurrentModule={setCurrentModule}
                    onSaveProjectNote={saveProjectNote}
                  />
                }
              />
              <Route path="/academia" element={<AcademyPage progress={progress} overallPercent={overallPercent} />} />
              <Route path="/conquistas" element={<AchievementsPage progress={progress} />} />
              <Route path="/jogos" element={<GamesPage progress={progress} onGameComplete={recordGameScore} />} />
              <Route
                path="/entrevista"
                element={<InterviewModePage interviewHistory={progress.interviewHistory} onSaveResult={addInterviewResult} />}
              />
              <Route path="/laboratorio" element={<LabPage />} />
              <Route
                path="/mentor"
                element={<MentorPage apiKey={settings.geminiApiKey} currentModuleId={progress.currentModuleId} progress={progress} />}
              />
              <Route
                path="/configuracoes"
                element={
                  <SettingsPage
                    apiKey={settings.geminiApiKey}
                    onSetApiKey={setApiKey}
                    onClearApiKey={clearApiKey}
                    onResetProgress={resetProgress}
                    progress={progress}
                    profileName={profileName}
                    onImportProgress={importProgress}
                  />
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>

      <BottomNav onMoreClick={() => setSidebarOpen(true)} />
      <XpToast event={lastXpGain} />
      <AchievementToast achievementId={newAchievement} onDismiss={clearNewAchievement} />
    </div>
  );
}
