import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/home" || location.pathname === "/home/";
  const isProfile = location.pathname.startsWith("/home/profile");

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/home");
  const goProfile = () => navigate("/home/profile");

  const baseIconStyle = {
    width: 40,
    height: 40,
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid transparent",
    backgroundColor: "transparent",
    transition: "0.15s ease",
    cursor: "pointer",
  };

  const activeGlow = {
    border: "2px solid #ffffff",
    boxShadow:
      "0 0 0 2px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.06)",
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">

        <nav
          className="navbar navbar-dark bg-black border-bottom border-secondary"
          style={{ height: "56px" }}
        >
          <div className="container-fluid px-3 d-flex align-items-center justify-content-between">
            {/* LEFT: back + home */}
            <div
              className="d-flex align-items-center"
              style={{ gap: "0.25rem" }}   // smaller gap
            >
              <button
                onClick={goBack}
                className="btn p-0 border-0 bg-transparent"
                style={baseIconStyle}
              >
                <i
                  className="bi bi-arrow-left text-light"
                  style={{ fontSize: "1.4rem" }}
                />
              </button>

              <button
                onClick={goHome}
                className="btn p-0 border-0 bg-transparent"
                style={{
                  ...baseIconStyle,
                  ...(isHome ? activeGlow : {}),
                }}
              >
                <i
                  className="bi bi-house-fill text-light"
                  style={{ fontSize: "1.4rem" }}
                />
              </button>
            </div>

            {/* RIGHT: profile avatar */}
            <button
              onClick={goProfile}
              className="btn p-0 border-0 bg-transparent"
              style={{
                ...baseIconStyle,
                ...(isProfile ? activeGlow : {}),
              }}
            >
              <img
                src="/images/profile.png"
                alt="Profile"
                className="rounded-circle"
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />
            </button>
          </div>
        </nav>

        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}