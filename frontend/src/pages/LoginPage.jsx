import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showError, setShowError] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();

		const response = await fetch("http://localhost:3001/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();
		if (data.success) {
			await login(data.user);
			navigate("/calendar");
		} else {
			setShowError(true);
		}
	};


	return (
		<>
			<div className="d-flex flex-column justify-content-center align-items-center h-100">
				<div className="text-center mb-5">
					<h1 className="text-white gochi-hand-regular">BUILD DIARY</h1>
				</div>
				<div className="card p-5 bg-body">

					{/* incorrect details alert */}
					{showError && (
						<div className="alert alert-danger alert-dismissible fade show" role="alert">
							<strong>Uh oh!</strong> Your details are incorrect.
							<button type="button" className="btn-close" onClick={() => setShowError(false)} data-bs-dismiss="alert" aria-label="Close"></button>
						</div>
					)}

					<form onSubmit={handleLogin} >

						<div className="mb-3">
							<label htmlFor="inputUsername" className="form-label">Username</label>
							<input type="text" className="form-control" id="inputUsername" onChange={(e) => setUsername(e.target.value)} />
						</div>
						<div className="mb-3">
							<label htmlFor="inputPassword" className="form-label">Password</label>
							<input type="password" className="form-control" id="inputPassword" onChange={(e) => setPassword(e.target.value)} />
						</div>
						{/* <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberCheck" />
            <label className="form-check-label" htmlFor="rememberCheck">Remember me</label>
          </div> */}
						<div className="d-grid mt-4">
							<button type="submit" className="btn btn-primary">Login</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}