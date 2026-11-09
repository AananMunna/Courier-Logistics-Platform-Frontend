"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny external store for row selection.
 *
 * Selection changes frequently (every click) but only the clicked row and the
 * toolbar care. Keeping it outside React state means the table, the virtualizer
 * and the other ~1,200 rows never re-render — each row subscribes to just
 * `isSelected(id)` through useSyncExternalStore's selector pattern.
 */
export function createSelectionStore() {
  let selected: ReadonlySet<string> = new Set();
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => selected,
    toggle(id: string) {
      const next = new Set(selected);
      next.has(id) ? next.delete(id) : next.add(id);
      selected = next;
      emit();
    },
    clear() {
      selected = new Set();
      emit();
    },
  };
}

export type SelectionStore = ReturnType<typeof createSelectionStore>;

/** Re-renders only when `isSelected(id)` flips for this id. */
export function useIsSelected(store: SelectionStore, id: string) {
  const getSnapshot = useCallback(
    () => store.getSnapshot().has(id),
    [store, id],
  );
  return useSyncExternalStore(store.subscribe, getSnapshot, () => false);
}

export function useSelectedCount(store: SelectionStore) {
  const getSnapshot = useCallback(() => store.getSnapshot().size, [store]);
  return useSyncExternalStore(store.subscribe, getSnapshot, () => 0);
}
