import { useState, useEffect } from "react";

export default function SettingsPage() {

	const [emailGreeting, setEmailGreeting] = useState("");
	const [emailClosing, setEmailClosing] = useState("");
	const [emailLoaded, setEmailLoaded] = useState(false);

	useEffect(() => {
		fetch("/api/settings")
			.then(res => res.json())
			.then(data => {
				setEmailGreeting(data.emailGreeting);
				setEmailClosing(data.emailClosing);
				setEmailLoaded(true);
			});
	}, []);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	function saveEmail(e) {
		e.preventDefault();

		fetch("/api/settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				greeting: emailGreeting,
				closing: emailClosing,
			})
		})
			.then((res) => res.json())
			// .then((data) => {
			// 	console.log("Updated settings:", data);
			// })
			.catch(console.error);
	}

	function validatePassword(password) {
		// combination of letters, numbers, and symbols
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]+$/;
		return regex.test(password);
	}

	function changePassword(e) {
		e.preventDefault();
		setPasswordError("");
		const form = e.target;

		// Check if required fields are filled
		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		// Custom validations for other errors
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords don't match :(");
			form.classList.add("was-validated");
			return;
		}

		if (newPassword.length < 8) {
			setPasswordError("Password must be minimum 8 characters long");
			form.classList.add("was-validated");
			return;
		}

		if (!validatePassword(newPassword)) {
			setPasswordError("Password must have upper and lowercase letters, numbers and symbols");
			form.classList.add("was-validated");
			return;
		}

		fetch("/api/changePassword", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				oldPassword,
				newPassword,
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					const toast = document.getElementById("passwordChangedToast");
					if (toast) {
						const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
						bsToast.show();
					}
					setOldPassword("");
					setNewPassword("");
					setConfirmPassword("");
					form.classList.remove("was-validated");
				} else {
					setPasswordError(data.message || "Failed to update password");
					form.classList.add("was-validated");
				}
			})
			.catch(console.error);
	}

	return (
		<div className="ps-1 pe-4 overflow-auto h-100">
			<form className="pt-4" onSubmit={saveEmail}>
				<h4>Confirmation emails to subcontractors</h4>
				{!emailLoaded ? (
					<div className="spinner-border my-3" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				) : (
					<>
						<div className="container-fluid mb-3 px-0 mt-3">
							<div className="row mb-2">
								<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
									<label htmlFor="subcontractorEmailGreeting" className="form-label mb-0">Default email greeting</label>
								</div>
								<div className="col-12 col-md">
									<textarea className="form-control mb-3 fst-italic" id="subcontractorEmailGreeting" rows="1" value={emailGreeting} onChange={(e) => setEmailGreeting(e.target.value)}></textarea>
									<p className="ms-2 mb-2"><i>Could you please confirm the booking for the <b className="fst-normal">event title</b> on the <b className="fst-normal">date</b> of <b className="fst-normal">month</b>?</i></p>
								</div>
							</div>
							<div className="row">
								<div className="col-12 col-md-auto pb-2" style={{ maxWidth: "200px", width: "100%" }}>
									<label htmlFor="subcontractorEmailClosing" className="form-label mb-0">Default email signature</label>
								</div>
								<div className="col-12 col-md">
									<textarea className="form-control fst-italic" id="subcontractorEmailClosing" rows="3" value={emailClosing} onChange={(e) => setEmailClosing(e.target.value)}></textarea>
								</div>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">Save changes</button>
					</>
				)}
			</form>
			<hr className="mx-2 my-4" />
			<form className="needs-validation" onSubmit={changePassword} noValidate>
				<h4>Change password</h4>
				<label htmlFor="oldPasswordInput" className="form-label">Old password</label>
				<input type="password" className="form-control mw-100" style={{ width: "450px" }} id="oldPasswordInput" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please enter your old password.
				</div>
				<label htmlFor="newPasswordInput" className="form-label mt-3">New password</label>
				<input type="password" className="form-control mw-100" style={{ width: "450px" }} id="newPasswordInput" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} aria-describedby="passwordHelpBlock" required></input>
				<div className="invalid-feedback">
					Please enter the new password.
				</div>
				<label htmlFor="confirmPasswordInput" className="form-label mt-3">Confirm new password</label>
				<input type="password" className="form-control mw-100" style={{ width: "450px" }} id="confirmPasswordInput" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></input>
				<div className="invalid-feedback">
					Please re-enter the new password.
				</div>
				<div id="passwordHelpBlock" className="form-text mb-3">
					Your password must be minimum 8 characters long, and be a combination of upper and lowercase letters, numbers and symbols.
				</div>
				{passwordError && (
					<div className="invalid-feedback d-block mb-3">
						{passwordError}
					</div>
				)}
				<button type="submit" className="btn btn-primary mb-4">Update password</button>
			</form>
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div id="passwordChangedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
					<div className="d-flex">
						<div className="toast-body">
							Password successfully updated.
						</div>
						<button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
				</div>
			</div>
		</div>

	);
}