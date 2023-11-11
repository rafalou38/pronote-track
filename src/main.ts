import assert from "assert";
import puppeteer from "puppeteer";
import { config } from "dotenv";
config();
import { delay } from "./utils";
import { CleanNote, Note, Notes } from "./types";
import { exit } from "process";
import { writeFileSync, readFileSync } from "fs";
import { advert } from "./advert";
import { getChartDataURL } from "./chart";

const SELECTOR_ID = '[placeholder="Identifiant"]';
const SELECTOR_PASSWORD = '[placeholder="Mot de passe"]';
const SELECTOR_SUBMIT = "button#id_11";
const SELECTOR_NOTES_TAB = "#GInterface\\.Instances\\[0\\]\\.Instances\\[1\\]_Combo2";

const LATEST_PATH = "latest.json";

async function gotData(notes: Notes) {
  let oldData: CleanNote[] = [];
  try {
    const text = readFileSync(LATEST_PATH).toString("utf8");
    oldData = JSON.parse(text) || [];
  } catch (error) {}

  const oldMapped = new Map(oldData.map((e) => [e.id, e]));

  const newGrades: CleanNote[] = [];
  const oldGrades: CleanNote[] = [];

  for (const note of notes.listeDevoirs.V) {
    const fait = note.date.V;
    const basePayload: CleanNote = {
      id: note.N,
      commentaire: note.commentaire,
      fait,
      classe: note.service.V.L,
      grade: parseFloat(note.note.V.replace(",", ".")),
      max: parseFloat(note.bareme.V.replace(",", ".")),
      color: note.service.V.couleur,
    };
    const id = basePayload.fait + basePayload.classe + basePayload.grade;
    basePayload.id = id;

    if (!oldMapped.has(id)) {
      const rendu = new Date().toLocaleDateString();
      basePayload.rendu = rendu;

      newGrades.push(basePayload);
    } else {
      basePayload.rendu = oldMapped.get(id)?.rendu;
      oldGrades.push(basePayload);
    }
  }

  if (newGrades.length > 0) {
    console.log("sending:");
    console.log("\t new:", newGrades.length);
    console.log("\t old:", oldGrades.length);
    const chartURI = await getChartDataURL(notes);
    await advert(newGrades, oldGrades, chartURI);
    writeFileSync(LATEST_PATH, JSON.stringify([...newGrades, ...oldGrades]));
  } else {
    console.log("nothing new");
  }

  console.log("Done.");

  exit(0);
}

async function main() {
  assert(process.env.id);
  assert(process.env.password);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    try {
      const data = await response.json();
      if (data?.donneesSec?.donnees?.listeDevoirs) {
        const notes: Notes = data.donneesSec.donnees;

        await page.close();
        await browser.close();

        await gotData(notes);
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

  await page.waitForSelector(SELECTOR_NOTES_TAB);
  await delay(2);
  await page.click(SELECTOR_NOTES_TAB);
}

main();
