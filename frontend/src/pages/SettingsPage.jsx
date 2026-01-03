import { useState } from "react";

export default function SettingsPage() {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subcontractorEmail, setSubcontractorEmail] = useState("");
	const [dayEmailNotif, setDayEmailNotif] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<>
			<form className="needs-validation" onSubmit={null} noValidate>
				<h4>Your details</h4>
				<label htmlFor="nameInput" className="form-label">Name</label>
				<input type="text" className="form-control mb-3" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required />
				<div className="invalid-feedback">
					Please enter your name.
				</div>
				<label htmlFor="emailInput" className="form-label">Email</label>
				<input type="email" className="form-control mb-3" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<div className="invalid-feedback">
					Please enter a valid email.
				</div>
				<h4>Communication</h4>
				<div className="mb-3">
					<label htmlFor="subcontractorText" className="form-label">Default email body for subcontractors</label>
					<textarea className="form-control" id="subcontractorText" rows="3" value={subcontractorEmail} onChange={(e) => setSubcontractorEmail(e.target.value)}></textarea>
				</div>
				<h4>Notifications</h4>
				<div className="form-check form-switch">
					<input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={(e) => setDayEmailNotif(e.target.value)} />
					<label className="form-check-label mb-3" for="switchCheckDefault">Receive an overview email the day before events are scheduled</label>
				</div>
				<h4>Change password</h4>
				<label htmlFor="oldPasswordInput" className="form-label">Old password</label>
				<input type="password" className="form-control mb-3" id="oldPasswordInput" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<label htmlFor="newPasswordInput" className="form-label">New password</label>
				<input type="password" className="form-control mb-3" id="newPasswordInput" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} aria-describedby="passwordHelpBlock" required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<label htmlFor="confirmPasswordInput" className="form-label">Confirm new password</label>
				<input type="password" className="form-control" id="confirmPasswordInput" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<div id="passwordHelpBlock" className="form-text mb-3">
					Your password must be 8-20 characters long, and be a combination of letters, numbers, and symbols.
				</div>
				<button type="submit" className="btn btn-primary">Save changes</button>
			</form>
		</>

	);
}