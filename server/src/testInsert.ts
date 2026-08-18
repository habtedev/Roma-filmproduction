import { db } from './db';
import { photos } from './db/schema';

async function test() {
  try {
    await db.insert(photos).values([{
      title: "Test",
      category: "Weddings",
      location: "Test",
      src: "Test",
      specs: "Test",
      featured: false,
      createdAt: new Date("2026-08-18T13:43:36.812Z")
    }]);
    console.log("Success");
  } catch (e) {
    console.log("Error:", e);
  }
}

test();
