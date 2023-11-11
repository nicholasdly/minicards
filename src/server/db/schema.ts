// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { customAlphabet } from 'nanoid';
import {
  MAX_CARD_BACK_LENGTH,
  MAX_CARD_FRONT_LENGTH,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_TITLE_LENGTH,
  NANO_ID_ALPHABET,
  NANO_ID_LENGTH
} from "~/constants";

/**
 * Generates a random string of specified alphabet and length using [Nano ID](https://github.com/ai/nanoid).
 * @returns A randomly generated string
 */
export function generateNanoId() {
  const nanoid = customAlphabet(NANO_ID_ALPHABET, NANO_ID_LENGTH);
  return nanoid();
}

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `minicards_${name}`);

export const decks = mysqlTable(
  "deck",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    publicId: varchar("public_id", { length: NANO_ID_LENGTH }).notNull().unique(),
    creatorId: varchar("creator_id", { length: 256 }).notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    title: varchar("title", { length: MAX_DECK_TITLE_LENGTH }).notNull(),
    description: varchar("description", { length: MAX_DECK_DESCRIPTION_LENGTH }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (deck) => ({
    publicIdIndex: index("public_id_idx").on(deck.publicId),
  })
);

export const cards = mysqlTable(
  "card",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    front: varchar("front", { length: MAX_CARD_FRONT_LENGTH }).notNull(),
    back: varchar("back", { length: MAX_CARD_BACK_LENGTH }).notNull(),
    deckId: bigint("deck_id", { mode: "number" }).notNull(),
  },
  (card) => ({
    deckIndex: index("deck_idx").on(card.deckId),
  })
);

export const decksRelations = relations(decks, ({ many }) => ({
  cards: many(cards)
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id]
  })
}));
