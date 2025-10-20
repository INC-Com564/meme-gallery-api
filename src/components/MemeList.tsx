import React from "react";
import { Meme } from "../types";

interface MemeListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function MemeList<T extends Meme>({ items, renderItem }: MemeListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
    </div>
  );
}