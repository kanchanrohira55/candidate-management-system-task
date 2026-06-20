import { useState } from "react";

export function AuthPage({ onLogin, onRegister }) {
	const [mode, setMode] = useState("login");
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Register validation
		if (mode === "register") {
			if (form.password.length < 6) {
				setError("Password must be at least 6 characters");
				setLoading(false);
				return;
			}
			if (form.password !== form.confirmPassword) {
				setError("Passwords do not match");
				setLoading(false);
				return;
			}
		}

		try {
			if (mode === "login") {
				await onLogin(form.email, form.password);
			} else {
				await onRegister(form.email, form.password);
			}
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-shell">
			<div className="auth-container">
				{/* Left Side - Image Section */}
				<div className="auth-image-section">
					<div className="auth-image-content">
						<div className="auth-image-logo">FS</div>
						<h1>Fresh Shifts</h1>
						<p>Enterprise Candidate Management Platform</p>
						<div className="auth-features">
							<span>🚀 Smart Recruitment</span>
							<span>📊 Real-time Analytics</span>
							<span>🔒 Enterprise Security</span>
						</div>
					</div>
				</div>

				{/* Right Side - Form Section */}
				<div className="auth-form-section">
					<div className="auth-form-panel">
						{/* Form Header */}
						<div className="auth-form-header">
							<h2>
								{mode === "login" ? "Welcome Back! 👋" : "Create Account ✨"}
							</h2>
							<p className="auth-subtitle">
								{mode === "login"
									? "Sign in to manage your candidates"
									: "Start your journey with Fresh Shifts"}
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="auth-form">
							{/* Email */}
							<div className="form-group">
								<label>📧 Email Address</label>
								<input
									type="email"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									required
									placeholder="you@company.com"
								/>
							</div>

							{/* Password */}
							<div className="form-group">
								<label>🔒 Password</label>
								<input
									type="password"
									value={form.password}
									onChange={(e) =>
										setForm({ ...form, password: e.target.value })
									}
									required
									placeholder={
										mode === "login" ? "••••••••" : "Min 6 characters"
									}
									minLength={6}
								/>
							</div>

							{/* Confirm Password (Register Only) */}
							{mode === "register" && (
								<div className="form-group">
									<label>✅ Confirm Password</label>
									<input
										type="password"
										value={form.confirmPassword}
										onChange={(e) =>
											setForm({ ...form, confirmPassword: e.target.value })
										}
										required
										placeholder="Confirm your password"
									/>
								</div>
							)}

							{/* Error Message */}
							{error && <p className="auth-error">{error}</p>}

							{/* Submit Button */}
							<button type="submit" disabled={loading} className="auth-btn">
								{loading
									? "⏳ Processing..."
									: mode === "login"
										? "🚀 Sign In"
										: "✨ Create Account"}
							</button>

							{/* Divider */}
							<div className="auth-divider">
								<span>or</span>
							</div>

							{/* Toggle Mode */}
							<button
								type="button"
								className="auth-toggle"
								onClick={() => {
									setMode(mode === "login" ? "register" : "login");
									setError("");
									setForm({ ...form, confirmPassword: "" });
								}}
							>
								{mode === "login"
									? "🆕 Don't have an account? Register"
									: "🔙 Already have an account? Sign In"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
