import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import "./AuthForm.css";

const categories = [
  "Business",
  "Entertainment",
  "General Health",
  "Science",
  "Sports",
  "Technology",
];

const AuthForm = ({ onClose, onAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  // NEW: Track selected interests
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Track auth state (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (onAuthChange) onAuthChange(currentUser); // update navbar
    });
    return () => unsubscribe();
  }, [onAuthChange]);

  // NEW: Handle checkbox toggle
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedInterests([...selectedInterests, value]);
    } else {
      setSelectedInterests(selectedInterests.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Store user in Firestore with interests
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          interests: selectedInterests, // NEW: save interests
        });
        alert("Successfully registered!");
      }
      onClose();
    } catch (err) {
      if (isLogin) {
        if (err.code === "auth/invalid-credential") {
          alert("Invalid email or password. Please check your details.");
        } else if (err.code === "auth/user-not-found") {
          alert("No account found. Please sign up first.");
        } else if (err.code === "auth/wrong-password") {
          alert("Wrong password. Try again.");
        } else {
          alert("Login failed: " + err.code + " - " + err.message);
        }
      } else {
        if (err.code === "auth/email-already-in-use") {
          alert("This email is already registered. Please login instead.");
        } else {
          alert("Signup failed: " + err.message);
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Show logout button if user is logged in
  if (user) {
    return (
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    );
  }

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* NEW: Show category checkboxes only during Sign Up */}
          {!isLogin && (
            <div className="interests-section">
              <p>Select your interests:</p>
              {categories.map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedInterests.includes(cat)}
                    onChange={handleInterestChange}
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
        <p className="google-link" onClick={handleGoogleSignIn}>
          Continue with Google
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

/*import React, { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import "./AuthForm.css";

const AuthForm = ({ onClose, onAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  // Track auth state (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (onAuthChange) onAuthChange(currentUser); // update navbar
    });
    return () => unsubscribe();
  }, [onAuthChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Store user in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), { email });
        alert("Successfully registered!");
      }
      onClose();
    } catch (err) {
      if (isLogin) {
        alert("User not found or wrong password. Please register.");
      } else {
        alert(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Show logout button if user is logged in
  if (user) {
    return <button className="logout-btn" onClick={handleLogout}>Logout</button>;
  }

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
        <p className="google-link" onClick={handleGoogleSignIn}>
          Continue with Google
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
*/
