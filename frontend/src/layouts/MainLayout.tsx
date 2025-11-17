import Navbar from "@/components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
;

  return (
    <div className="min-h-screen flex flex-col  w-screen">
      {/* Navbar stays fixed */}
      <Navbar />

      {/* Routed children will appear here */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
