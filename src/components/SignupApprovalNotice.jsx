function SignupApprovalNotice({ message, onGoToLogin }) {
  return (
    <div className="approval-notice" role="status" aria-live="polite">
      <div className="approval-icon">⏳</div>
      <div className="approval-content">
        <h3>Signup Request Submitted</h3>
        <p>{message || "Wait for owner approval before login."}</p>
      </div>
      <button type="button" className="primary approval-cta" onClick={onGoToLogin}>
        Go to Login
      </button>
    </div>
  );
}

export default SignupApprovalNotice;
