import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("oil_prices.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS oil_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    diesel REAL,
    gasohol95 REAL,
    gasohol91 REAL,
    gasoholE20 REAL,
    gasoholE85 REAL,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    date TEXT,
    category TEXT
  );
`);

// Seed initial data if empty
const rowCount = db.prepare("SELECT COUNT(*) as count FROM oil_prices").get() as { count: number };
if (rowCount.count === 0) {
  const insert = db.prepare("INSERT INTO oil_prices (company, diesel, gasohol95, gasohol91, gasoholE20, gasoholE85) VALUES (?, ?, ?, ?, ?, ?)");
  insert.run("PTT", 29.94, 30.55, 30.18, 28.34, 26.29);
  insert.run("Shell", 29.94, 31.85, 31.28, 29.44, 27.50);
  insert.run("Bangchak", 29.94, 30.55, 30.18, 28.34, 26.29);
  insert.run("PT", 29.94, 30.55, 30.18, 28.34, 26.29);
  insert.run("Caltex", 29.94, 30.55, 30.18, 28.34, 26.29);
  insert.run("Esso", 29.94, 30.55, 30.18, 28.34, 26.29);
  insert.run("Susco", 29.94, 30.55, 30.18, 28.34, 26.29);

  const insertNews = db.prepare("INSERT INTO news (title, summary, date, category) VALUES (?, ?, ?, ?)");
  insertNews.run("Global Oil Prices Stabilize", "Market analysts predict a steady trend for the upcoming week as supply chains recover.", "2026-03-11", "Market");
  insertNews.run("New Biofuel Policy Announced", "The Ministry of Energy introduces new incentives for E20 and E85 consumption.", "2026-03-10", "Policy");
  insertNews.run("Electric Vehicle Impact on Fuel Demand", "A recent study shows a 5% decrease in traditional fuel demand in urban areas.", "2026-03-09", "Energy");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/oilprice", (req, res) => {
    const prices = db.prepare("SELECT * FROM oil_prices ORDER BY update_time DESC LIMIT 10").all();
    res.json(prices);
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.get("/api/history", (req, res) => {
    // Mock historical data for the last 7 days
    const history = [
      { date: "Mar 05", diesel: 29.50, gasohol95: 30.10, gasohol91: 29.80 },
      { date: "Mar 06", diesel: 29.65, gasohol95: 30.25, gasohol91: 29.95 },
      { date: "Mar 07", diesel: 29.80, gasohol95: 30.40, gasohol91: 30.10 },
      { date: "Mar 08", diesel: 29.80, gasohol95: 30.40, gasohol91: 30.10 },
      { date: "Mar 09", diesel: 29.94, gasohol95: 30.55, gasohol91: 30.18 },
      { date: "Mar 10", diesel: 29.94, gasohol95: 30.55, gasohol91: 30.18 },
      { date: "Mar 11", diesel: 29.94, gasohol95: 30.55, gasohol91: 30.18 },
    ];
    res.json(history);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
