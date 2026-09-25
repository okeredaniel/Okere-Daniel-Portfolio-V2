import { Sparkles, Bell, CalendarDays, Contact2 } from "lucide-react";
import "./HeaderActions.css";
import avatarSrcq from "../assets/simp.png"
import { useNavigate, Link } from "react-router-dom";

 
const ITEMS = [
  { id: "updates", label: "About", Icon: Sparkles, path: "/About" },
  { id: "notifications", label: "Work", Icon: Bell, path: "/Connect" },
  { id: "schedules", label: "Skills", Icon: CalendarDays, path: "/Skills" },
  { id: "contact", label: "Contacts", Icon: Contact2, path: "/Contact" },
];


function formatCount(n) {
  return n > 99 ? "99+" : String(n);
}

export default function HeaderActions({
  activePanel = null,
  onSelect,
  counts = {},
  avatarSrc,
  avatarName = "Profile",
  status = "online",
  onProfileClick,
  path
}) {
  const safeStatus = status === "away" || status === "offline" ? status : "online";

  return (
    <div className="ha">
      <div className="ha-pill" role="toolbar" aria-label="Panels">
        {ITEMS.map(({ id, label, Icon, path }) => {
          const active = activePanel === id;
          const count = counts[id] ?? 0;

          return (
            <Link
            to={path}
              key={id}
              type="button"
              className={`ha-btn${active ? " is-active" : ""}`}
              aria-label={label}
              aria-pressed={active}
              title={label}
              onClick={() => onSelect?.(id)}
            >
              <Icon className="ha-icon" size={18} strokeWidth={1.75} aria-hidden="true" />
              <span className="ha-label-wrap" aria-hidden="true">
                <span className="ha-label">{label}</span>
              </span>
              {count > 0 && (
                <span className="ha-badge" aria-label={`${count} unread`}>
                  {formatCount(count)}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <Link
        to="/"
        className="ha-avatar"
        data-status={safeStatus}
        aria-label={`${avatarName} (${safeStatus})`}
        onClick={onProfileClick}
      >
   <img src={avatarSrcq} alt="" draggable={false} />

      </Link>
    </div>
  );
}
