import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────

type UserRole = "ADMIN" | "EOS" | "SUPERVISOR" | "TECHNICIAN" | "GUEST";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  nip?: string | null;
  createdAt: string | Date;
}

// ─── Config ───────────────────────────────────────────────────

const roleConfig: Record<
  UserRole,
  { icon: string; badge: string; avatar: string; dot: string; strip: string }
> = {
  ADMIN: {
    icon: "⚡",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    avatar: "bg-red-500/10 text-red-400",
    dot: "bg-red-400",
    strip: "bg-red-400",
  },
  EOS: {
    icon: "👁",
    badge: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    avatar: "bg-teal-500/10 text-teal-400",
    dot: "bg-teal-400",
    strip: "bg-teal-400",
  },
  SUPERVISOR: {
    icon: "🛡",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    avatar: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
    strip: "bg-amber-400",
  },
  TECHNICIAN: {
    icon: "🔧",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    avatar: "bg-violet-500/10 text-violet-400",
    dot: "bg-violet-400",
    strip: "bg-violet-400",
  },
  GUEST: {
    icon: "◦",
    badge: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    avatar: "bg-zinc-500/10 text-zinc-400",
    dot: "bg-zinc-400",
    strip: "bg-zinc-500",
  },
};

// ─── Helpers ──────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          {label}
        </p>
        <p className="truncate text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export function UserCard({ user }: { user: User }) {
  const cfg = roleConfig[user.role] ?? roleConfig.GUEST;

  return (
    <Card className="group relative w-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top accent strip */}
      <div className={`absolute inset-x-0 top-0 h-[3px] ${cfg.strip}`} />

      <CardHeader className="pt-7 pb-0">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-lg font-black tracking-tight ${cfg.avatar}`}
            style={{ width: 52, height: 52 }}
          >
            {getInitials(user.name)}
          </div>

          {/* Name / username / role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black tracking-tight text-foreground">
              {user.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground/60">
              @{user.username}
            </p>
            <Badge
              variant="outline"
              className={`mt-1.5 gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest ${cfg.badge}`}
            >
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${cfg.dot}`}
              />
              {user.role}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-0">
        <Separator className="mb-5" />
        <div className="flex flex-col gap-3">
          <DetailRow icon="✉" label="Email" value={user.email} />
          {user.nip && <DetailRow icon="#" label="NIP" value={user.nip} />}
          <DetailRow
            icon={cfg.icon}
            label="Access Level"
            value={user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          />
        </div>
      </CardContent>

      <CardFooter className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 pb-5">
        <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground/50">
          ID #{String(user.id).padStart(4, "0")}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/50">
          Joined {formatDate(user.createdAt)}
        </span>
      </CardFooter>
    </Card>
  );
}
