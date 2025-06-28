require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection (from .env)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "water_management",
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1); // Exit on error
  }
  console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "r2110359h@students.msu.ac.zw",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// POST /api/reports - Submit a new water leak report
app.post("/api/reports", async (req, res) => {
  const { name, contact, location, issue } = req.body;

  if (!name || !contact || !location || !issue) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!contact.startsWith("+263")) {
    return res.status(400).json({ error: "Invalid phone number format. Must start with +263" });
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    // Insert new report
    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO reports (name, contact, location, issue, status, created_at) VALUES (?, ?, ?, ?, 'pending', ?)",
        [name, contact, location, issue, timestamp],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Get pending reports count
    const [pendingCountResult] = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM reports WHERE status = 'pending'", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const pendingCount = pendingCountResult.count;

    // Prepare email
    const mailOptions = {
      from: "r2110359h@students.msu.ac.zw",
      to: "christabelchrissy01@gmail.com",
      subject: `New Water Leak Report - ${location}`,
      html: `
        <h2>New Water Leak Report Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Issue:</strong> ${issue}</p>
        <p><strong>Report Time:</strong> ${timestamp}</p>
        <hr>
        <p><strong>Total Active Leaks:</strong> ${pendingCount}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Mark as notified
    await new Promise((resolve, reject) => {
      db.query("UPDATE reports SET notified = 1 WHERE id = ?", [result.insertId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      message: "Report submitted successfully and notification sent",
      reportId: result.insertId,
    });

  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// GET /api/reports/status/:contact - Check report status by contact number
app.get("/api/reports/status/:contact", (req, res) => {
  const { contact } = req.params;

  if (!/^\+2637[1|3|7|8][0-9]{7}$/.test(contact)) {
    return res.status(400).json({ error: "Invalid Zimbabwean phone number format." });
  }

  db.query(
    "SELECT id, status, created_at FROM reports WHERE contact = ? ORDER BY created_at DESC LIMIT 1",
    [contact],
    (err, results) => {
      if (err) {
        console.error("Database error in status check:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.json({
          status: "No report found",
          message: "No report found for this contact number",
        });
      }

      res.json({
        id: results[0].id,
        status: results[0].status,
        created_at: results[0].created_at,
        message: `Report status: ${results[0].status}`,
      });
    }
  );
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});