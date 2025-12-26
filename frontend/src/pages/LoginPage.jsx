export default function LoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card p-5">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Uh oh!</strong> Your details are incorrect.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="inputUsername" className="form-label">Username</label>
            <input type="text" className="form-control" id="inputUsername" aria-describedby="emailHelp" />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input type="password" className="form-control" id="inputPassword" />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
          </div>
          <div className="d-grid">
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}