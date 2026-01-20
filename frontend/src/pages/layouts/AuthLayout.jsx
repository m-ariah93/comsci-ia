import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-100 vh-100" style={{ backgroundImage: "linear-gradient(150deg, #4A7E8D, #A3BDC3)" }}>
      <Outlet />
    </div>
  );
}
