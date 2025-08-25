export default function Login({ onLogin }) {
  return (
    <div className="login-container">
      <h2 className="login-title">Sign In / Sign Up</h2>
      <input type="email" placeholder="Email" className="input-field" />
      <input type="password" placeholder="Password" className="input-field" />
      <button className="btn primary" onClick={onLogin}>
        Login with Email
      </button>
      <button className="btn secondary" onClick={onLogin}>
        Sign Up with Email
      </button>
      <div className="divider">OR</div>
      <button className="btn google" onClick={onLogin}>
        Sign in with Google
      </button>
    </div>
  );
}