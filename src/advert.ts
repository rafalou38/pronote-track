import { Note } from "./types";
import nodemailer from "nodemailer";

export async function advert(notes: Note[]) {
  for (const note of notes) {
    const date = note.date.V;
    const classe = note.service.V.L;
    const points = note.note.V + "/" + note.bareme.V;
  }
}
