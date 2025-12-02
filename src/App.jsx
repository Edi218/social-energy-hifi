import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/home" || location.pathname === "/home/";
  const isProfile = location.pathname.startsWith("/home/profile");
  const isNotifications = location.pathname.startsWith("/home/notifications");
  const isFriends = location.pathname.startsWith("/home/friends");

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/home");
  const goProfile = () => navigate("/home/profile");
  const goNotifications = () => navigate("/home/notifications");
  const goFriends = () => navigate("/home/friends");
  

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
        {/* NAVBAR */}
        <nav
          className="navbar navbar-dark bg-black border-bottom border-secondary"
          style={{ height: "56px" }}
        >
          <div className="container-fluid px-3 d-flex align-items-center justify-content-between">
            {/* LEFT: back + home */}
            <div
              className="d-flex align-items-center"
              style={{ gap: "0.25rem" }}
            >
              {/* Back Button */}
              <button
                onClick={isHome ? undefined : goBack}
                className="btn p-0 border-0 bg-transparent"
                style={{
                  ...baseIconStyle,
                  opacity: isHome ? 0.25 : 1,
                  cursor: isHome ? "default" : "pointer",
                }}
                disabled={isHome}
              >
                <i
                  className={`bi bi-arrow-left text-light ${isHome ? "" : "icon-pop"}`}
                  style={{ fontSize: "1.4rem" }}
                />
              </button>

              {/* Home Button */}
              <button
                onClick={goHome}
                className="btn p-0 border-0 bg-transparent"
                style={{
                  ...baseIconStyle,
                  ...(isHome ? activeGlow : {}),
                }}
              >
                <i
                  className={`bi bi-house-fill text-light ${
                    isHome ? "icon-active-pulse" : "icon-pop"
                  }`}
                  style={{ fontSize: "1.4rem" }}
                />
              </button>
            </div>


            <div className="d-flex align-items-center" style={{ gap: "0.4rem" }}>

  {/* Notifications Icon */}
  <button
    onClick={goNotifications}
    className="btn p-0 border-0 bg-transparent"
    style={{
      ...baseIconStyle,
      ...(isNotifications ? activeGlow : {}),
    }}
  >
    <i
      className={`bi bi-bell-fill text-light ${isNotifications ? "icon-bounce" : "icon-pop"}`}
      style={{ fontSize: "1.25rem" }}
    />
  </button>

  {/* Friends List Icon */}
    <button
      onClick={goFriends}
      className="btn p-0 border-0 bg-transparent"
      style={{
        ...baseIconStyle,
        ...(isFriends ? activeGlow : {}),
      }}
    >
      <i
        className={`bi bi-people-fill text-light ${isFriends ? "icon-active-pulse" : "icon-pop"}`}
        style={{ fontSize: "1.3rem" }}
      />
    </button>

    {/* Profile Avatar */}
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
        className={`rounded-circle ${isProfile ? "icon-active-pulse" : "icon-pop"}`}
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
    </button>

  </div>

          </div>
        </nav>

        {/* CONTENT */}
        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
