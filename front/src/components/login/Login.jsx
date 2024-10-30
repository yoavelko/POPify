import './Login.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Login({ closeLoginModal, isUpdateMode = false }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    const [showUpdate, setShowUpdate] = useState(isUpdateMode);

    // שליפת נתוני המשתמש מה-localStorage אם קיים
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFirstName(parsedUser.name);
            setLastName(parsedUser.lastName);
            setSignupEmail(parsedUser.email);
        }
    }, []);

    // פונקציה לטיפול בהתחברות משתמש
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/user/login', {
                email: loginEmail,
                password: loginPassword,
            });
    
            if (response.status === 200) {
                alert('Login successful!');
                const { id, name, lastName, email, address } = response.data.user;
                const userData = { id, name, lastName, email, address };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                closeLoginModal();
            }
        
        } catch (error) {
            console.error('Error logging in:', error);
            setLoginError('Login failed.');
        }
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            alert("User data is missing. Please log in again.");
            return;
        }
        try {
            const response = await axios.put('http://localhost:3001/user/update-user', { // עדכון ה-URL לנתיב הנכון
                userId: user.id,
                name: firstName,
                lastName: lastName,
                email: signupEmail,
                password: signupPassword || undefined,
                address: "sham",
            });
    
            if (response.status === 200) {
                alert('User details updated successfully');
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setShowUpdate(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating details');
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeLoginModal}>X</button>
                
                {!showSignup && !showUpdate ? (
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
                            <button type="submit" className="login-button">LOGIN</button>
                        </form>
                        <p className="toggle-form">
                            Don't have an account? <span onClick={() => setShowSignup(true)}>Sign up here</span>
                        </p>
                    </div>
                ) : showSignup ? (
                    <div className="signup-section">
                        <h2>Create new account</h2>
                        <form onSubmit={handleSignupSubmit}>
                            {/* שדות להרשמה */}
                        </form>
                        <p className="toggle-form">
                            Already have an account? <span onClick={() => setShowSignup(false)}>Log in here</span>
                        </p>
                    </div>
                ) : (
                    <div className="update-section">
                        <h2>Update Your Details</h2>
                        <form onSubmit={handleUpdateSubmit}>
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
                                    placeholder="Enter new password if changing" 
                                    value={signupPassword} 
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="update-button">SAVE CHANGES</button>
                        </form>
                        <p className="toggle-form">
                            Done updating? <span onClick={() => setShowUpdate(false)}>Go back</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
