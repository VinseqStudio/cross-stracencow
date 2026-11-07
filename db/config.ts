import { column, defineDb, defineTable } from 'astro:db';

/** Jedna edycja biegu. */
const Edition = defineTable({
  columns: {
    year: column.number({ primaryKey: true }),
    number: column.text(), // numer rzymski, np. "XV"
    date: column.text({ optional: true }), // ISO, np. "2025-04-27"
    resultsUrl: column.text({ optional: true }), // oficjalne źródło wyników
    resultsLabel: column.text({ optional: true }),
    galleryUrl: column.text({ optional: true }), // galeria na starej stronie
  },
});

/** Jeden wynik zawodnika w jednym biegu danej edycji. */
const Result = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    year: column.number({ references: () => Edition.columns.year }),
    race: column.text(),
    place: column.number(),
    placeSex: column.number({ optional: true }),
    bib: column.text({ optional: true }),
    name: column.text(),
    city: column.text({ optional: true }),
    club: column.text({ optional: true }),
    sex: column.text(), // "M" | "K"
    category: column.text({ optional: true }),
    time: column.text(),
  },
  indexes: [{ on: ['year', 'race', 'place'] }],
});

export default defineDb({ tables: { Edition, Result } });
