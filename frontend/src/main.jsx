import { createRoot } from "react-dom/client";
import "./styles.css";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";

function App() {
  const { token, userEmail, login, register, logout } = useAuth();

  if (!token) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  return <HomePage token={token} userEmail={userEmail} onLogout={logout} />;
}

createRoot(document.getElementById("root")).render(<App />);
