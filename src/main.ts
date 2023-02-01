import assert from "assert";
import puppeteer from "puppeteer";
import { config } from "dotenv";
import { delay } from "./utils";
import { Note, Notes } from "./types";
import { exit } from "process";
import { writeFileSync, readFileSync } from "fs";
config();

const SELECTOR_ID = '[placeholder="Identifiant"]';
const SELECTOR_PASSWORD = '[placeholder="Mot de passe"]';
const SELECTOR_SUBMIT = "button#id_12";

const LATEST_PATH = "latest.json";

function gotData(notes: Notes) {
  try {
    const text = readFileSync(LATEST_PATH).toString("utf8");
    const oldData = JSON.parse(text) as Notes;

    const oldMapped = new Map(oldData.listeDevoirs.V.map((e) => [e.N, e]));

    const newGrades: Note[] = [];

    for (const note of notes.listeDevoirs.V) {
      if (!oldMapped.has(note.N)) {
        newGrades.push(note);
      }
    }
  } catch (error) {}

  writeFileSync(LATEST_PATH, JSON.stringify(notes));
  console.log("Done.");

  exit(0);
}

async function main() {
  assert(process.env.id);
  assert(process.env.password);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    try {
      const data = await response.json();
      const notes: Notes | null = data?.donneesSec?.donnees?.notes;
      if (notes) {
        await page.close();
        await browser.close();

        gotData(notes);
      }
    } catch (error) {
      return;
    }
  });

  await page.goto(
    "https://0383243u.index-education.net/pronote/eleve.html?login=true"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box
  await page.waitForSelector(SELECTOR_ID);

  await page.type(SELECTOR_ID, process.env.id);
  await page.type(SELECTOR_PASSWORD, process.env.password);

  await page.click(SELECTOR_SUBMIT);
}

main();
