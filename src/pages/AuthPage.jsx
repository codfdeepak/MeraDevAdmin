import logoDark from "../assets/logo1.png";
import logoLight from "../assets/logo2.png";
import SignupApprovalNotice from "../components/SignupApprovalNotice";

function AuthPage({
  mode,
  theme,
  setTheme,
  loginData,
  setLoginData,
  signupData,
  setSignupData,
  handleLogin,
  handleSignup,
  isLoading,
  error,
  signupNotice,
  goToLogin,
  goToSignup,
}) {
  return (
    <section className="auth-shell">
      <div className="auth-topbar">
        <button
          type="button"
          className="theme-btn"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </button>
      </div>
      <div className="hero-panel panel auth-card" style={{ marginBottom: 14 }}>
        <div className="auth-logo">
          <img src={theme === "dark" ? logoDark : logoLight} alt="Brand logo" />
        </div>
        <h1 className="text-center">
          {mode === "login" ? "Admin Access Login" : "Admin Access Sign up"}
        </h1>
        <p className="muted">
          {mode === "login"
            ? "Sign in with your mobile and password to manage the admin dashboard."
            : "Create your admin login with your full name, mobile, and a strong password."}
        </p>

        {mode === "login" && (
          <form className="form compact" onSubmit={handleLogin}>
            <label className="field">
              <span>Mobile number</span>
              <input
                name="mobile"
                type="tel"
                inputMode="numeric"
                placeholder="+91 00000 00000"
                value={loginData.mobile}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Minimum 8 characters"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                minLength={8}
                disabled={isLoading}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Authorising…" : "Login Securely"}
            </button>

            <p className="muted" style={{ textAlign: "center", marginTop: 12 }}>
              New here?{" "}
              <button
                className="link-btn"
                type="button"
                onClick={goToSignup}
                disabled={isLoading}
              >
                Create an account
              </button>
            </p>
          </form>
        )}

        {signupNotice && (
          <SignupApprovalNotice message={signupNotice} onGoToLogin={goToLogin} />
        )}

        {mode === "signup" && !signupNotice && (
          <form className="form compact" onSubmit={handleSignup}>
            <label className="field">
              <span>Full name</span>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Mobile number</span>
              <input
                name="mobile"
                type="tel"
                inputMode="numeric"
                placeholder="+91 00000 00000"
                value={signupData.mobile}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                minLength={8}
                disabled={isLoading}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create & Continue"}
            </button>

            <p className="muted" style={{ textAlign: "center", marginTop: 12 }}>
              Already onboarded?{" "}
              <button
                className="link-btn"
                type="button"
                onClick={goToLogin}
                disabled={isLoading}
              >
                Go to login
              </button>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export default AuthPage;
