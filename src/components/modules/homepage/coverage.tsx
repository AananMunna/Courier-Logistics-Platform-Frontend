import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { SectionHeading } from "./section-heading";

const NODES = [
  { name: "Rangpur", x: 150, y: 40 },
  { name: "Rajshahi", x: 70, y: 130 },
  { name: "Mymensingh", x: 250, y: 90 },
  { name: "Sylhet", x: 370, y: 90 },
  { name: "Dhaka", x: 230, y: 175 },
  { name: "Khulna", x: 110, y: 250 },
  { name: "Barishal", x: 230, y: 275 },
  { name: "Chattogram", x: 360, y: 250 },
];
const LINKS = [
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 5],
  [4, 6],
  [4, 7],
  [5, 6],
  [6, 7],
];

export default function Coverage() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div className="space-y-8">
          <SectionHeading
            title="A hub network that reaches every division"
            description="Parcels travel between hubs, then the last mile by rider. See the hub nearest to you."
          />
          <LinkButton
            href="/hubs"
            size="lg"
            variant="outline"
            className="h-11 px-5"
          >
            Find a hub <ArrowRight />
          </LinkButton>
        </div>
        <div className="rounded-3xl border bg-card p-4 md:p-6">
          <svg
            viewBox="0 0 440 310"
            className="w-full"
            role="img"
            aria-label="Network of hubs connected through Dhaka"
          >
            {LINKS.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke="currentColor"
                className="cg-dash text-foreground/20"
                strokeWidth="1.5"
              />
            ))}
            {NODES.map((n, i) => (
              <g key={n.name}>
                {i === 4 && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="10"
                    fill="var(--primary)"
                    className="cg-ping"
                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={i === 4 ? 9 : 6}
                  fill={i === 4 ? "var(--primary)" : "var(--card)"}
                  stroke={i === 4 ? "var(--card)" : "var(--foreground)"}
                  strokeWidth="2.5"
                />
                <text
                  x={n.x}
                  y={n.y + (i === 4 ? 26 : 20)}
                  textAnchor="middle"
                  className="fill-foreground text-[11px] font-medium"
                >
                  {n.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
