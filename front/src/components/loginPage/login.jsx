import './loginPage.css'
import { useState } from 'react';

function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLoginSubmit = (event) => {
        event.preventDefault();
    };

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        if (signupPassword !== confirmPassword) {
            alert('Passwords do not match');
        } else {
        }
    };

    return (
        <div className="content-wrapper">
            <div className="login-section">
                <h2>Log in</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Your Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Your Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="remember" name="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div><br />
                    <button type="submit" className="login-button">LOGIN</button>
                </form>
            </div>

            <div className="signup-section">
                <h2>Create new account</h2>
                <form onSubmit={handleSignupSubmit}>
                    <div className="input-group">
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
                    </div>
                    <div className="input-group">
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
                    <div className="input-group">
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
                    <div className="input-group">
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
                    </div><br />
                    <button type="submit" className="signup-button">CREATE USER</button>
                </form>
            </div>
        </div>
    )
}

export default Login