// src/pages/Notifications.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulated notifications with different types
    const mockNotifications = [
      {
        id: 1,
        type: "event-signup",
        friend: "Elynn Lee",
        event: "Coffee Chat",
        timestamp: "2 minutes ago",
        icon: "bi-check-circle-fill",
        color: "rgba(34, 197, 94, 0.85)",
        read: false,
      },
      {
        id: 2,
        type: "direct-message",
        friend: "Oscar Dum",
        message: "Thanks! I might take up on that",
        timestamp: "15 minutes ago",
        icon: "bi-chat-left-fill",
        color: "rgba(59, 130, 246, 0.85)",
        read: false,
      },
      {
        id: 3,
        type: "event-hosting",
        friend: "Carlo Emilion",
        event: "Group Study Sprint",
        timestamp: "1 hour ago",
        icon: "bi-star-fill",
        color: "rgba(249, 115, 22, 0.85)",
        read: false,
      },
      {
        id: 4,
        type: "friend-available",
        friend: "Ava Becker",
        status: "just came online",
        timestamp: "2 hours ago",
        icon: "bi-circle-fill",
        color: "rgba(34, 197, 94, 0.7)",
        read: true,
      },
      {
        id: 5,
        type: "event-upcoming",
        event: "Casual Dinner Out",
        location: "Nooch Zurich",
        time: "in 3 hours",
        timestamp: "3 hours ago",
        icon: "bi-alarm-fill",
        color: "rgba(168, 85, 247, 0.85)",
        read: true,
      },
      {
        id: 6,
        type: "friend-nearby",
        friend: "Lucas Hwang",
        location: "ETH Campus",
        timestamp: "4 hours ago",
        icon: "bi-geo-alt-fill",
        color: "rgba(239, 68, 68, 0.85)",
        read: true,
      },
      {
        id: 7,
        type: "event-cancelled",
        event: "Quiet Library Study",
        friend: "Sophia Nguyen",
        timestamp: "Yesterday",
        icon: "bi-x-circle-fill",
        color: "rgba(239, 68, 68, 0.75)",
        read: true,
      },
      {
        id: 8,
        type: "achievement",
        achievement: "Social Butterfly",
        description: "You've joined 5 events this week!",
        timestamp: "2 days ago",
        icon: "bi-award-fill",
        color: "rgba(251, 191, 36, 0.85)",
        read: true,
      },
      {
        id: 9,
        type: "event-signup",
        friend: "Noah Tanaka",
        event: "Sunset Bench Hangout",
        timestamp: "2 days ago",
        icon: "bi-person-plus-fill",
        color: "rgba(34, 197, 94, 0.75)",
        read: true,
      },
      {
        id: 10,
        type: "event-upcoming",
        event: "Group Study Sprint",
        location: "HG E33",
        time: "in 6 hours",
        timestamp: "2 days ago",
        icon: "bi-alarm-fill",
        color: "rgba(168, 85, 247, 0.75)",
        read: true,
      },
      {
        id: 11,
        type: "event-cancelled",
        event: "Cozy Board Game Night",
        friend: "Lucas Hwang",
        timestamp: "3 days ago",
        icon: "bi-x-circle-fill",
        color: "rgba(234, 88, 12, 0.75)",
        read: true,
      },
      {
        id: 12,
        type: "event-signup",
        friend: "Isabella Fontaine",
        event: "Mensa Dessert Break",
        timestamp: "3 days ago",
        icon: "bi-check-circle-fill",
        color: "rgba(34, 197, 94, 0.7)",
        read: true,
      },
      {
        id: 13,
        type: "event-upcoming",
        event: "Casual Dinner Out",
        location: "Nooch Zurich",
        time: "Tomorrow evening",
        timestamp: "4 days ago",
        icon: "bi-alarm-fill",
        color: "rgba(99, 102, 241, 0.7)",
        read: true,
      },
      {
        id: 14,
        type: "event-cancelled",
        event: "Quiet Café Work Session",
        friend: "Chloe Ricci",
        timestamp: "5 days ago",
        icon: "bi-x-circle-fill",
        color: "rgba(239, 68, 68, 0.65)",
        read: true,
      },
      {
        id: 15,
        type: "event-signup",
        friend: "Mateo Alvarez",
        event: "Problem-Solving Session",
        timestamp: "6 days ago",
        icon: "bi-check-circle-fill",
        color: "rgba(34, 197, 94, 0.65)",
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.type === "direct-message") {
      navigate("/home/friends");
    } else if (
      notification.type === "event-signup" ||
      notification.type === "event-hosting" ||
      notification.type === "event-upcoming"
    ) {
      navigate("/home");
    }
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const getNotificationContent = (notif) => {
    switch (notif.type) {
      case "event-signup":
        return (
          <>
            <div className="text-white fw-semibold">{notif.friend}</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              signed up for <strong>{notif.event}</strong>
            </div>
          </>
        );
      case "direct-message":
        return (
          <>
            <div className="text-white fw-semibold">{notif.friend}</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              {notif.message}
            </div>
          </>
        );
      case "event-hosting":
        return (
          <>
            <div className="text-white fw-semibold">{notif.friend}</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              is hosting <strong>{notif.event}</strong>
            </div>
          </>
        );
      case "friend-available":
        return (
          <>
            <div className="text-white fw-semibold">{notif.friend}</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              {notif.status}
            </div>
          </>
        );
      case "event-upcoming":
        return (
          <>
            <div className="text-white fw-semibold">Event Reminder</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              <strong>{notif.event}</strong> starts {notif.time} at{" "}
              {notif.location}
            </div>
          </>
        );
      case "friend-nearby":
        return (
          <>
            <div className="text-white fw-semibold">{notif.friend}</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              is nearby at <strong>{notif.location}</strong>
            </div>
          </>
        );
      case "event-cancelled":
        return (
          <>
            <div className="text-white fw-semibold">Event Cancelled</div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              <strong>{notif.event}</strong> cancelled by {notif.friend}
            </div>
          </>
        );
      case "achievement":
        return (
          <>
            <div className="text-white fw-semibold">
              🎉 {notif.achievement}
            </div>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              {notif.description}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0 text-white d-flex align-items-center gap-2">
          <i className="bi bi-bell-fill" style={{ fontSize: "24px" }}></i>
          Notifications
          {unreadCount > 0 && (
            <span
              className="badge bg-danger"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
            >
              {unreadCount}
            </span>
          )}
        </h3>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <i
            className="bi bi-inbox text-secondary"
            style={{ fontSize: "3rem", opacity: 0.5 }}
          ></i>
          <p className="text-secondary mt-3">
            You don&apos;t have any notifications yet. When your friends invite
            you to events, they&apos;ll show up here. 🔔
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className="card border-0"
              style={{
                backgroundColor: notif.read
                  ? "#010c28"
                  : "rgba(59, 130, 246, 0.08)",
                borderLeft: `4px solid ${notif.color}`,
                cursor: "pointer",
                transition:
                  "all 0.25s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Subtle shimmer effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  pointerEvents: "none",
                }}
                className={notif.read ? "" : "notification-shine"}
              />

              <div className="card-body d-flex align-items-center gap-3 py-3">
                {/* Icon */}
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: `${notif.color}20`,
                    border: `2px solid ${notif.color}`,
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`bi ${notif.icon}`}
                    style={{
                      fontSize: "1.3rem",
                      color: notif.color,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  {getNotificationContent(notif)}
                </div>

                {/* Unread indicator + timestamp */}
                <div
                  className="d-flex flex-column align-items-end gap-2"
                  style={{ flexShrink: 0 }}
                >
                  {!notif.read && (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        animation: "pulse-dot 2s infinite",
                      }}
                    />
                  )}
                  <div
                    className="text-secondary"
                    style={{ fontSize: "0.8rem", opacity: 0.7 }}
                  >
                    {notif.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes pulse-dot {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes notification-shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .notification-shine {
          animation: notification-shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}