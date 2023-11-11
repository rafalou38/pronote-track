import { CleanNote, Note } from "./types";
import nodemailer from "nodemailer";
import nun from "nunjucks";
import * as fs from "fs";
import assert from "assert";
import { config } from "dotenv";
config();

const template = fs.readFileSync("email.html", "utf8").toString();
const transporter = nodemailer.createTransport({
  host: "smtp.orange.fr",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.emailUser, // generated ethereal user
    pass: process.env.emailPass, // generated ethereal password
  },
});

export async function advert(newGrades: CleanNote[], oldGrades: CleanNote[], chartURI: string) {
  assert(template);

  const html = nun.renderString(template, { newGrades, oldGrades, chartURI });

  let info = await transporter.sendMail({
    from: process.env.sender,
    bcc: process.env.to,
    subject: newGrades.length + " nouvelle notes",
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
