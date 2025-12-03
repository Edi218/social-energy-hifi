import React from "react";

export default function QuoteCard({
  title,
  text,
  iconBg = "#1e293b",
  icon,
  borderColor,
}) {
  return (
    <div
      className="card mb-4"
      style={{
        backgroundColor: "#0b0f1a",
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        padding: "1.25rem",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        {/* ICON CIRCLE */}
        <div
          className="quote-icon pulse-icon"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            color: "#facc15",
            flexShrink: 0,
            border: `1px solid ${borderColor}`,
          }}
        >
          {icon}
        </div>

        {/* QUOTE CONTENT */}
        <div>
          <h5 className="text-white fw-semibold mb-2">{title}</h5>
          <p
            className="text-secondary mb-0"
            style={{ lineHeight: "1.45rem" }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
