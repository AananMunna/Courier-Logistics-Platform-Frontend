"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { ShipmentStatusBadge } from "@/components/shared/status-badge";
import { VirtualList } from "@/components/shared/virtual-list";
import { Button } from "@/components/ui/button";
import {
  type ExplorerActivity,
  type ExplorerShipment,
  generateActivity,
  generateShipments,
} from "@/lib/mock-data";
import {
  createSelectionStore,
  useIsSelected,
  useSelectedCount,
} from "@/lib/selection-store";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/utils";

const SHIPMENT_ROW = 52;
const ACTIVITY_ROW = 60;

// ---------------------------------------------------------------- shipments

const ShipmentRow = memo(function ShipmentRow({
  row,
  store,
  onToggle,
}: {
  row: ExplorerShipment;
  store: ReturnType<typeof createSelectionStore>;
  onToggle: (id: string) => void;
}) {
  // Subscribes to this row's selection only — siblings never re-render.
  const selected = useIsSelected(store, row.id);
  return (
    <button
      type="button"
      onClick={() => onToggle(row.id)}
      aria-pressed={selected}
      className={cn(
        "grid h-full w-full grid-cols-[1.1fr_1.4fr_auto] items-center gap-3 border-b px-4 text-left text-sm transition-colors hover:bg-primary/[0.04] md:grid-cols-[1fr_1.4fr_1fr_auto_auto]",
        selected && "bg-primary/10",
      )}
    >
      <span className="truncate font-mono font-medium text-primary">
        {row.trackingCode}
      </span>
      <span className="truncate">{row.route}</span>
      <span className="hidden truncate text-muted-foreground md:block">
        {row.receiver}
      </span>
      <ShipmentStatusBadge status={row.status} />
      <span className="hidden text-right font-medium tabular-nums md:block">
        {formatCurrency(row.fee)}
      </span>
    </button>
  );
});

const ShipmentHeader = memo(function ShipmentHeader() {
  return (
    <div className="grid grid-cols-[1.1fr_1.4fr_auto] gap-3 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground md:grid-cols-[1fr_1.4fr_1fr_auto_auto]">
      <span>Tracking</span>
      <span>Route</span>
      <span className="hidden md:block">Receiver</span>
      <span>Status</span>
      <span className="hidden text-right md:block">Fee</span>
    </div>
  );
});

function ShipmentsPanel({ data }: { data: ExplorerShipment[] }) {
  // Debounced input (see SearchInput) → only the committed term lives in state.
  const [term, setTerm] = useState("");
  // Selection lives in an external store, not React state.
  const store = useRef(createSelectionStore()).current;
  const selectedCount = useSelectedCount(store);
  // Fast-moving scroll position: a ref + direct DOM write, zero renders.
  const positionRef = useRef<HTMLSpanElement>(null);

  const rows = useMemo(() => {
    const needle = term.toLowerCase();
    return needle
      ? data.filter(
          (row) =>
            row.trackingCode.toLowerCase().includes(needle) ||
            row.receiver.toLowerCase().includes(needle) ||
            row.route.toLowerCase().includes(needle),
        )
      : data;
  }, [data, term]);

  const onToggle = useCallback((id: string) => store.toggle(id), [store]);
  const renderRow = useCallback(
    (row: ExplorerShipment) => (
      <ShipmentRow row={row} store={store} onToggle={onToggle} />
    ),
    [store, onToggle],
  );
  const getKey = useCallback((row: ExplorerShipment) => row.id, []);
  const onVisibleStart = useCallback(
    (index: number) => {
      if (positionRef.current) {
        positionRef.current.textContent = `Row ${index + 1} of ${rows.length.toLocaleString()}`;
      }
    },
    [rows.length],
  );

  return (
    <section className="space-y-3" aria-labelledby="explorer-shipments">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="explorer-shipments" className="text-base font-semibold">
            Shipments ({rows.length.toLocaleString()})
          </h2>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            <span ref={positionRef}>
              Row 1 of {rows.length.toLocaleString()}
            </span>
            {selectedCount > 0 && ` · ${selectedCount} selected`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            value={term}
            onSearch={setTerm}
            placeholder="Search tracking, receiver, route"
            label="Search shipments"
          />
          {selectedCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => store.clear()}>
              Clear
            </Button>
          )}
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-2xl border bg-card py-16 text-center text-sm text-muted-foreground">
          No shipments match “{term}”.
        </p>
      ) : (
        <VirtualList
          items={rows}
          rowHeight={SHIPMENT_ROW}
          height={420}
          overscan={8}
          label="Shipments"
          header={<ShipmentHeader />}
          getKey={getKey}
          renderRow={renderRow}
          onVisibleStart={onVisibleStart}
        />
      )}
    </section>
  );
}

// ----------------------------------------------------------------- activity

const ActivityRow = memo(function ActivityRow({
  row,
}: {
  row: ExplorerActivity;
}) {
  return (
    <div className="flex h-full items-center justify-between gap-3 border-b px-4 text-sm">
      <div className="min-w-0">
        <p className="truncate">
          <span className="font-mono font-medium text-primary">
            {row.trackingCode}
          </span>{" "}
          <span className="text-muted-foreground">· {row.note}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {row.actor} · {formatDateTime(row.createdAt)}
        </p>
      </div>
      <ShipmentStatusBadge status={row.status} />
    </div>
  );
});

const renderActivity = (row: ExplorerActivity) => <ActivityRow row={row} />;
const getActivityKey = (row: ExplorerActivity) => row.id;

function ActivityPanel({ data }: { data: ExplorerActivity[] }) {
  const [term, setTerm] = useState("");

  const rows = useMemo(() => {
    const needle = term.toLowerCase();
    return needle
      ? data.filter(
          (row) =>
            row.trackingCode.toLowerCase().includes(needle) ||
            row.note.toLowerCase().includes(needle) ||
            row.actor.toLowerCase().includes(needle),
        )
      : data;
  }, [data, term]);

  return (
    <section className="space-y-3" aria-labelledby="explorer-activity">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="explorer-activity" className="text-base font-semibold">
          Activity feed ({rows.length.toLocaleString()})
        </h2>
        <SearchInput
          value={term}
          onSearch={setTerm}
          placeholder="Search tracking, note, actor"
          label="Search activity"
        />
      </div>
      {rows.length === 0 ? (
        <p className="rounded-2xl border bg-card py-16 text-center text-sm text-muted-foreground">
          No activity matches “{term}”.
        </p>
      ) : (
        <VirtualList
          items={rows}
          rowHeight={ACTIVITY_ROW}
          height={420}
          overscan={6}
          label="Activity feed"
          getKey={getActivityKey}
          renderRow={renderActivity}
        />
      )}
    </section>
  );
}

// --------------------------------------------------------------------- root

export default function LargeDataExplorer() {
  // Generated once per mount; the panels get stable references.
  const shipments = useMemo(() => generateShipments(1200), []);
  const activity = useMemo(() => generateActivity(1500), []);

  return (
    <div className="space-y-8">
      <ShipmentsPanel data={shipments} />
      <ActivityPanel data={activity} />
    </div>
  );
}
