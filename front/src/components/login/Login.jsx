import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

function Login({ closeLoginModal }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSignup, setShowSignup] = useState(false); // State to toggle between login and signup forms

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post("http://localhost:3001/user/login", {
            email: loginEmail,
            password: loginPassword,
          });
      
          if (response.status === 200) {
            const { user } = response.data;
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            //cookies.set("userId", user.id);
            console.log(user);
      
            // שחזור העגלה מהשרת
            const cartResponse = await axios.get(`http://localhost:3001/user/${user.id}/cart`);
            const { cart } = cartResponse.data;
      
            localStorage.setItem("cart", JSON.stringify(cart || []));
            console.log("Cart restored successfully:", cart);
      
            closeLoginModal();
            window.location.reload();
          }
        } catch (error) {
          console.error("Error logging in:", error.message);
          setLoginError("Login failed.");
        }
      };
      
    
    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        if (signupPassword !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            try {
                const response = await axios.post('http://localhost:3001/user', {
                    name: firstName,
                    lastName: lastName,
                    email: signupEmail,
                    password: signupPassword,
                });

                if (response.status === 201) {
                    alert('User created successfully');
                    closeLoginModal();
                } else {
                    alert('Error creating user');
                }
            } catch (error) {
                console.error('Error creating user:', error);
                alert('Error creating user');
            }
        }
    };

    return (
        <div className="modal-overlay">
        <div className="form-modal-content">
            <button className="form-close-button" onClick={closeLoginModal}>X</button>
            
            {!showSignup ? (
                <div className="login-section">
                    <h2>Log in</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <div className="custom-input-group">
                            <label htmlFor="login-email">Email address</label>
                            <input 
                                type="email" 
                                id="login-email" 
                                name="login-email" 
                                placeholder="Your Email" 
                                className="custom-input-group"
                                value={loginEmail} 
                                onChange={(e) => setLoginEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="custom-input-group">
                            <label htmlFor="login-password">Password</label>
                            <input 
                                type="password" 
                                id="login-password" 
                                name="login-password" 
                                className="custom-input-group"
                                placeholder="Your Password" 
                                value={loginPassword} 
                                onChange={(e) => setLoginPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        {loginError && <p className="error-message">{loginError}</p>}
                        <button type="submit" className="login-button">LOGIN</button>
                    </form>
                    <p className="toggle-form">
                        Don't have an account? <span onClick={() => setShowSignup(true)}>Sign up here</span>
                    </p>
                </div>
            ) : (
                <div className="signup-section">
                    <h2>Create new account</h2>
                    <form onSubmit={handleSignupSubmit}>
                        <div className="custom-input-group">
                            <label htmlFor="first-name">First name</label>
                            <input 
                                type="text" 
                                id="first-name" 
                                name="first-name" 
                                placeholder="Your First Name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                       
                        <div className="custom-input-group">
                            <label htmlFor="last-name">Last name</label>
                            <input 
                                type="text" 
                                id="last-name" 
                                name="last-name" 
                                placeholder="Your Last Name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="custom-input-group">
                            <label htmlFor="signup-email">Email address</label>
                            <input 
                                type="email" 
                                id="signup-email" 
                                name="signup-email" 
                                placeholder="Your Email" 
                                value={signupEmail} 
                                onChange={(e) => setSignupEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="custom-input-group">
                            <label htmlFor="signup-password">Password</label>
                            <input 
                                type="password" 
                                id="signup-password" 
                                name="signup-password" 
                                placeholder="Your Password" 
                                value={signupPassword} 
                                onChange={(e) => setSignupPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="custom-input-group">
                            <label htmlFor="confirm-password">Confirm your Password</label>
                            <input 
                                type="password" 
                                id="confirm-password" 
                                name="confirm-password" 
                                placeholder="Confirm Your Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        </div>
                        <button type="submit" className="signup-button">CREATE USER</button>
                    </form>
                    <p className="toggle-form">
                        Already have an account? <span onClick={() => setShowSignup(false)}>Log in here</span>
                    </p>
                </div>
            )}
        </div>
    </div>
);
}

export default Login;