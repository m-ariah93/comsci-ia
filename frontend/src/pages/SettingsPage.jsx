import { useState, useEffect } from "react";

export default function SettingsPage() {

	const [emailGreeting, setEmailGreeting] = useState("");
	const [emailClosing, setEmailClosing] = useState("");

	useEffect(() => {
		fetch("http://localhost:3001/settings")
			.then(res => res.json())
			.then(data => {
				setEmailGreeting(data.emailGreeting);
				setEmailClosing(data.emailClosing);
			});
	}, []);

	const [dayEmailNotif, setDayEmailNotif] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function saveEmail(e) {
		e.preventDefault();
		const form = e.target;
		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		if (!emailGreeting || !emailClosing) {
			form.classList.add("was-validated");
			return;
		}

		fetch("http://localhost:3001/settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				greeting: emailGreeting,
				closing: emailClosing,
			})
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Updated settings:", data);
			})
			.catch(console.error);
	}

	return (
		<div className="pe-4">
			<form className="needs-validation pt-4" onSubmit={saveEmail} noValidate>
				<h4>Confirmation emails to subcontractors</h4>
				<div className="container-fluid mb-3 px-0 mt-3">
					<div className="row mb-2">
						<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
							<label htmlFor="subcontractorEmailGreeting" className="form-label mb-0">Default email greeting</label>
						</div>
						<div className="col-12 col-md">
							<textarea className="form-control mb-3 fst-italic" id="subcontractorEmailGreeting" rows="1" value={emailGreeting} onChange={(e) => setEmailGreeting(e.target.value)} required></textarea>
							<p className="ms-2 mb-2"><i>Could you please confirm the booking for the <b>event title</b> on the <b>date</b> of <b>month</b>?</i></p>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
							<label htmlFor="subcontractorEmailClosing" className="form-label mb-0">Default email signature</label>
						</div>
						<div className="col-12 col-md">
							<textarea className="form-control fst-italic" id="subcontractorEmailClosing" rows="3" value={emailClosing} onChange={(e) => setEmailClosing(e.target.value)} required></textarea>
						</div>
					</div>
				</div>
				<button type="submit" className="btn btn-primary">Save changes</button>
			</form>
			<hr className="mx-2 my-4" />
			<h4>Notifications</h4>
			<div className="form-check form-switch">
				<input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={(e) => setDayEmailNotif(e.target.value)} />
				<label className="form-check-label" htmlFor="switchCheckDefault">Receive an overview email the day before events are scheduled</label>
			</div>
			<hr className="mx-2 my-4" />
			<form className="needs-validation" onSubmit={null} noValidate>
				<h4>Change password</h4>
				<label htmlFor="oldPasswordInput" className="form-label">Old password</label>
				<input type="password" className="form-control mb-3 mw-100" style={{ width: "450px" }} id="oldPasswordInput" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<label htmlFor="newPasswordInput" className="form-label">New password</label>
				<input type="password" className="form-control mb-3 mw-100" style={{ width: "450px" }} id="newPasswordInput" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} aria-describedby="passwordHelpBlock" required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<label htmlFor="confirmPasswordInput" className="form-label">Confirm new password</label>
				<input type="password" className="form-control mw-100" style={{ width: "450px" }} id="confirmPasswordInput" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please enter a password.
				</div>
				<div id="passwordHelpBlock" className="form-text mb-3">
					Your password must be 8-20 characters long, and be a combination of letters, numbers, and symbols.
				</div>
				<button type="submit" className="btn btn-primary mb-4">Update password</button>
			</form>
		</div>

	);
}