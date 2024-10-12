import './Login.css';
import { useState } from 'react';
import axios from 'axios';

function Login() {
    // State for login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser]=useState(null);

    // State for signup form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Function to handle login
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/user/login', {
                email: loginEmail,
                password: loginPassword,
            });
    
            if (response.status === 200) {
                alert('Login successful!');
                console.log(response.data);
                if(response.data.user){
                const { name, lastName}=response.data.user;
                setUser({name, lastName});
                localStorage.setItem('user', JSON.stringify({ name, lastName }));
            }
        }
        
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed.');
        }
    };
    
    // Function to handle signup
    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        if (signupPassword !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            try {
                console.log('Sending signup request...');
                const response = await axios.post('http://localhost:3001/user', {
                    name: firstName,
                    lastName: lastName,
                    email: signupEmail,
                    password: signupPassword,
                });

                console.log('Response:', response);

                if (response.status === 201) {
                    alert('User created successfully');
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
        
        <div className="content-wrapper">
            {/* Login Form */}
            <div className="login-section">
                <h2>Log in</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label htmlFor="login-email">Email address</label>
                        <input 
                            type="email" 
                            id="login-email" 
                            name="login-email" 
                            placeholder="Your Email" 
                            value={loginEmail} 
                            onChange={(e) => setLoginEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            name="login-password" 
                            placeholder="Your Password" 
                            value={loginPassword} 
                            onChange={(e) => setLoginPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {loginError && <p className="error-message">{loginError}</p>}
                    <div className="checkbox-group">
                        <input type="checkbox" id="remember" name="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div><br />
                    <button type="submit" className="login-button">LOGIN</button>
                </form>
            </div>

            {/* Signup Form */}
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
    );
}

export default Login;
