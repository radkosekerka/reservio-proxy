const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Token a Business ID
const TOKEN = "Bearer <TVŮJ_ACCESS_TOKEN>";
const BUSINESS_ID = "ae088849-d88e-4619-a3cb-09bb0719c405";
const API_BASE = "https://api.reservio.com/v2";

// 1. Získání služeb
app.get("/api/services", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/businesses/${BUSINESS_ID}/services`, {
      headers: { Authorization: TOKEN },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services." });
  }
});

// 2. Volné sloty
app.get("/api/slots", async (req, res) => {
  const { employee_id, service_id, from } = req.query;
  try {
    const response = await axios.get(`${API_BASE}/availability`, {
      headers: { Authorization: TOKEN },
      params: { employee_id, service_id, from },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots." });
  }
});

// 3. Rezervace
app.post("/api/book", async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/bookings`, req.body, {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking.", details: err.response?.data });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
