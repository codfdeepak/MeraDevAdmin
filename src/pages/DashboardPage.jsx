function DashboardPage({
  user,
  about,
  theme,
  setTheme,
  handleAvatarUpload,
  profileStatus,
  profileError,
  resetSession,
  TAB_GROUPS,
  TAB_LABELS,
  activeTab,
  setActiveTab,
  sectionTitle,
  profile,
  toast,
  renderServicesTabs,
  displayNameDraft,
  setDisplayNameDraft,
  handleSaveDisplayName,
  canSaveDisplayName,
  savingSection,
}) {
  const dashboardTitle =
    user?.role === "partner"
      ? "Partner's Dashboard"
      : `${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"} Dashboard`;

  return (
    <section className="panel data-panel">
      <div className="panel-top panel-top-stack">
        <div className="panel-head-left">
          <div className="dashboard-header-block">
            <h1 className="dashboard-main-title">{dashboardTitle}</h1>
          </div>
          <div className="theme-toggle dashboard-theme-toggle">
            <span className="muted">Theme</span>
            <div className="toggle-buttons">
              <button
                type="button"
                className={`toggle-btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                className={`toggle-btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
          <div className="profile-inline">
            <div className="avatar-stack">
              <div className="avatar large">
                {about.avatar ? (
                  <img src={about.avatar} alt="Admin avatar" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div className="identity-block">
                <div className="pill">
                  Role:{" "}
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "Admin"}
                </div>
                <h4>{user.fullName || "Admin user"}</h4>
                <div className="name-edit-row">
                  <input
                    className="name-input"
                    type="text"
                    value={displayNameDraft}
                    placeholder="Update your name"
                    onChange={(e) => setDisplayNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveDisplayName();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="chip-btn"
                    onClick={handleSaveDisplayName}
                    disabled={!canSaveDisplayName || savingSection === "display-name"}
                  >
                    {savingSection === "display-name" ? "Saving..." : "Update"}
                  </button>
                </div>
                <p className="muted">Mobile: {user.mobile || "—"}</p>
                <label className="upload-btn small">
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="status-wrap">
          <span className={`status-pill ${profileStatus}`}>
            {profileStatus === "loading"
              ? "Saving…"
              : profileStatus === "succeeded"
                ? "Saved"
                : profileStatus === "failed"
                  ? "Error"
                  : "Idle"}
          </span>
          {profileError && <p className="error">{profileError}</p>}
          <button className="ghost" type="button" onClick={resetSession}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-shell">
        <div className="side-nav">
          {TAB_GROUPS?.map((group) => (
            <div
              className={`nav-group ${group.key === "profile-setup" ? "profile-nav-group" : ""} ${group.key === "owner-access" ? "owner-nav-group" : ""}`}
              key={group.key}
            >
              <p className="nav-group-title">{group.title}</p>
              {group.key === "profile-setup" && (
                <div className="profile-mobile-select-wrap">
                  <select
                    className="profile-mobile-select"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                  >
                    {group.tabs.map((key) => (
                      <option key={key} value={key}>
                        {TAB_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div
                className={`nav-group-list ${group.key === "profile-setup" ? "profile-scroll-tabs" : ""}`}
              >
                {group.tabs.map((key) => (
                  <button
                    key={key}
                    className={`nav-btn ${activeTab === key ? "active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab(key)}
                  >
                    {TAB_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="cms-body">
          <div className="section-meta">
            <div className="pill">{sectionTitle}</div>
            <div className="pill">
              Last updated:{" "}
              {profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleString()
                : "—"}
            </div>
          </div>

          {toast && <div className="success-banner">{toast}</div>}

          {renderServicesTabs[activeTab]?.()}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
