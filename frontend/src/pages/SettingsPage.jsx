import { useState, useEffect } from "react";

export default function SettingsPage() {

	const [emailGreeting, setEmailGreeting] = useState("");
	const [emailClosing, setEmailClosing] = useState("");
	const [emailLoaded, setEmailLoaded] = useState(false);

	useEffect(() => {
		fetch("/api/emailSettings")
			.then(res => res.json())
			.then(data => {
				setEmailGreeting(data.emailGreeting);
				setEmailClosing(data.emailClosing);
				setEmailLoaded(true);
			});
	}, []);

	const [dayEmailNotif, setDayEmailNotif] = useState(false);
	const [emailAddress, setEmailAddress] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	useEffect(() => {
		fetch("/api/notificationSettings")
			.then(res => res.json())
			.then(data => {
				setDayEmailNotif(Boolean(data.notifications));
				setEmailAddress(data.emailAddress || "");
			});
	}, []);

	function handleNotificationToggle(e) {
		const newValue = e.target.checked;
		setDayEmailNotif(newValue);

		fetch("/api/notificationSettings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				notifications: newValue ? 1 : 0,
				emailAddress: emailAddress
			})
		})
			.then(res => res.json())
			.catch(console.error);
	}

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

		fetch("/api/emailSettings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				greeting: emailGreeting,
				closing: emailClosing,
			})
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					const toast = document.getElementById("emailTemplateSavedToast");
					if (toast) {
						const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
						bsToast.show();
					}
					form.classList.remove("was-validated");
				}
			})
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

		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		// custom validations for other errors
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

	function changeEmail(e) {
		e.preventDefault();
		const form = e.target;

		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		if (!emailAddress) {
			form.classList.add("was-validated");
			return;
		}

		fetch("/api/notificationSettings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				notifications: dayEmailNotif ? 1 : 0,
				emailAddress: emailAddress
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					const toast = document.getElementById("emailAddressSavedToast");
					if (toast) {
						const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
						bsToast.show();
					}
					form.classList.remove("was-validated");
				}
			})
			.catch(console.error);
	}

	return (
		<div className="ps-1 pe-4 overflow-auto h-100">
			<form className="needs-validation pt-4" onSubmit={saveEmail} noValidate>
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
									<textarea className="form-control mb-3 fst-italic" id="subcontractorEmailGreeting" rows="1" value={emailGreeting} onChange={(e) => setEmailGreeting(e.target.value)} required></textarea>
									<p className="ms-2 mb-2"><i>Could you please confirm the booking for the <b className="fst-normal">event title</b> on the <b className="fst-normal">date</b> of <b className="fst-normal">month</b>?</i></p>
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
					</>
				)}
			</form>
			<hr className="mx-2 my-4" />
			<h4>Notifications</h4>
			<div className="form-check form-switch">
				<input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" checked={dayEmailNotif} onChange={handleNotificationToggle} />
				<label className="form-check-label" htmlFor="switchCheckDefault">Receive an overview email the day before events are scheduled</label>
			</div>
			{dayEmailNotif && (
				<form className="needs-validation" onSubmit={changeEmail} noValidate>
					<label htmlFor="emailAddressInput" className="form-label mt-3">Your email address</label>
					<input type="email" className="form-control mw-100" style={{ width: "450px" }} id="emailAddressInput" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required></input>
					<div className="invalid-feedback">
						Please enter a valid email.
					</div>
					<button type="submit" className="btn btn-primary mt-3">Save email</button>
				</form>
			)}
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
				<div id="emailTemplateSavedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
					<div className="d-flex">
						<div className="toast-body">
							Default email template saved successfully.
						</div>
						<button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
				</div>
				<div id="emailAddressSavedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
					<div className="d-flex">
						<div className="toast-body">
							Email address saved successfully.
						</div>
						<button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
				</div>
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