import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-100 vh-100">
      <Outlet />
    </div>
  );
}
