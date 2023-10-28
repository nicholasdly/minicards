// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `minicards_${name}`);

export const decks = mysqlTable(
  "deck",
export const decks = mysqlTable(
  "deck",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }),
    creatorId: varchar("creator_id", { length: 256 }),
    name: varchar("name", { length: 100 }),
    creatorId: varchar("creator_id", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (deck) => ({
    nameIndex: index("name_idx").on(deck.name),
  })
);

export const cards = mysqlTable(
  "card",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    deckId: bigint("deck_id", { mode: "number" }),
    front: varchar("front", { length: 256 }).notNull(),
    back: varchar("back", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (card) => ({
    deckIndex: index("deck_idx").on(card.deckId),
  })
);

export const usersRelations = relations(decks, ({ many }) => ({
  cards: many(cards)
}));

export const blocksRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id]
  })
}));
