import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getSectionRenderers } from "./components/SectionRenderers";
import { useAdminApp } from "./hooks/useAdminApp";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { TAB_LABELS } from "./utils/adminConstants";
import { fetchOwnerHeroSlides } from "./store/thunks/heroThunks";
import { fetchOwnerProjects } from "./store/thunks/projectThunks";
import { fetchOwnerServices } from "./store/thunks/serviceThunks";
import "./App.css";
import "./index.css";

function AppShell({ children, isAuthView }) {
  return (
    <div className={`page${isAuthView ? " auth-mode" : ""}`}>
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="glow glow-c" />
      <div className="content-shell">{children}</div>
    </div>
  );
}

function App() {
  const admin = useAdminApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthView = location.pathname !== "/dashboard";

  const renderServicesTabs = getSectionRenderers({
    ...admin,
    fetchOwnerServices,
    fetchOwnerProjects,
    fetchOwnerHeroSlides,
  });

  return (
    <AppShell isAuthView={isAuthView}>
      <Routes>
        <Route
          path="/login"
          element={
            admin.user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage
                mode="login"
                theme={admin.theme}
                setTheme={admin.setTheme}
                loginData={admin.loginData}
                setLoginData={admin.setLoginData}
                signupData={admin.signupData}
                setSignupData={admin.setSignupData}
                handleLogin={admin.handleLogin}
                handleSignup={admin.handleSignup}
                isLoading={admin.isLoading}
                error={admin.error}
                signupNotice={admin.signupNotice}
                goToLogin={() => navigate("/login")}
                goToSignup={() => navigate("/signup")}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            admin.user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage
                mode="signup"
                theme={admin.theme}
                setTheme={admin.setTheme}
                loginData={admin.loginData}
                setLoginData={admin.setLoginData}
                signupData={admin.signupData}
                setSignupData={admin.setSignupData}
                handleLogin={admin.handleLogin}
                handleSignup={admin.handleSignup}
                isLoading={admin.isLoading}
                error={admin.error}
                signupNotice={admin.signupNotice}
                goToLogin={() => navigate("/login")}
                goToSignup={() => navigate("/signup")}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            admin.user ? (
              <DashboardPage
                user={admin.user}
                about={admin.about}
                theme={admin.theme}
                setTheme={admin.setTheme}
                handleAvatarUpload={admin.handleAvatarUpload}
                profileStatus={admin.profileStatus}
                profileError={admin.profileError}
                resetSession={admin.resetSession}
                TAB_GROUPS={admin.tabGroups}
                TAB_LABELS={TAB_LABELS}
                activeTab={admin.activeTab}
                setActiveTab={admin.setActiveTab}
                sectionTitle={admin.sectionTitle}
                profile={admin.profile}
                toast={admin.toast}
                renderServicesTabs={renderServicesTabs}
                displayNameDraft={admin.displayNameDraft}
                setDisplayNameDraft={admin.setDisplayNameDraft}
                handleSaveDisplayName={admin.handleSaveDisplayName}
                canSaveDisplayName={admin.canSaveDisplayName}
                savingSection={admin.savingSection}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={admin.user ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </AppShell>
  );
}

export default App;
