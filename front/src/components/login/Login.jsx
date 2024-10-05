import './Login.css'

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // הוספת הלוגיקה שלך כאן לטיפול בטופס
    console.log({ email, password, rememberMe });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex-column">
        <label>Email</label>
      </div>
      <div className="inputForm">
        <input
          placeholder="Enter your Email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex-column">
        <label>Password</label>
      </div>
      <div className="inputForm">
        <input
          placeholder="Enter your Password"
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex-row">
        <div>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label>Remember me</label>
        </div>
        <span className="span">Forgot password?</span>
      </div>

      <button className="button-submit" type="submit">Sign In</button>

      <p className="p">
        Don't have an account? <span className="span">Sign Up</span>
      </p>
      
      <p className="p line">Or With</p>
      
      <div className="flex-row">
        {/* ניתן להוסיף אייקונים נוספים של רשתות חברתיות כאן */}
      </div>
    </form>
  );
}

export default LoginForm;
