import { useState } from "react";

export default function SettingsPage() {

	const [name, setName] = useState("Neil");
	const [email, setEmail] = useState("neil@example.com");
	const [emailGreeting, setEmailGreeting] = useState("Hello,");
	const [emailClosing, setEmailClosing] = useState("Neil\nAchievement Homes");
	const [dayEmailNotif, setDayEmailNotif] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<>
			<form className="needs-validation pt-4 pe-4" onSubmit={null} noValidate>
				<h4 className="">Your details</h4>
				<label htmlFor="nameInput" className="form-label">Name</label>
				<input type="text" className="form-control mb-3" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required />
				<div className="invalid-feedback">
					Please enter your name.
				</div>
				<label htmlFor="emailInput" className="form-label">Email</label>
				<input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<div className="invalid-feedback">
					Please enter a valid email.
				</div>
				<hr className="mx-2 my-4"/>
				<h4>Communication with subcontractors</h4>
				<div className="container-fluid mb-3 px-0 mt-3">
					<div className="row mb-2">
						<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
							<label htmlFor="subcontractorEmailGreeting" className="form-label mb-0">Default email greeting</label>
						</div>
						<div className="col-12 col-md">
							<textarea className="form-control mb-3 fst-italic" id="subcontractorEmailGreeting" rows="1" value={emailGreeting} onChange={(e) => setEmailGreeting(e.target.value)}></textarea>
							<p className="ms-2 mb-2"><i>Could you please confirm the booking for the <b>event title</b> on the <b>date</b> of <b>month</b>?</i></p>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
							<label htmlFor="subcontractorEmailClosing" className="form-label mb-0">Default email closing</label>
						</div>
						<div className="col-12 col-md">
							<textarea className="form-control fst-italic" id="subcontractorEmailClosing" rows="3" value={emailClosing} onChange={(e) => setEmailClosing(e.target.value)}></textarea>
						</div>
					</div>
				</div>
				<hr className="mx-2 my-4"/>
				<h4>Notifications</h4>
				<div className="form-check form-switch">
					<input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={(e) => setDayEmailNotif(e.target.value)} />
					<label className="form-check-label" htmlFor="switchCheckDefault">Receive an overview email the day before events are scheduled</label>
				</div>
				<hr className="mx-2 my-4"/>
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
				<button type="submit" className="btn btn-primary mb-4">Save changes</button>
			</form >
		</>

	);
}