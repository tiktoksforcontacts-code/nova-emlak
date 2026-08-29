const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "ilanlar.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

app.use(express.json({ limit: "20mb" }));
app.use(express.static(__dirname));

// İlan dosyası yoksa oluştur
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Upload klasörü yoksa oluştur
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use("/uploads", express.static(UPLOAD_DIR));

// ===============================
// İLANLARI GETİR
// ===============================
app.get("/api/ilanlar", (req, res) => {
    try {
        const ilanlar = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

        res.json(ilanlar);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "İlanlar okunamadı."
        });
    }
});

// ===============================
// YENİ İLAN EKLE
// ===============================
app.post("/api/ilanlar", (req, res) => {
    try {
        const ilanlar = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

        const yeniIlan = {
            id: Date.now(),
            title: req.body.title || "",
            type: req.body.type || "",
            city: req.body.city || "",
            price: Number(req.body.price) || 0,
            rooms: req.body.rooms || "",
            area: Number(req.body.area) || 0,
            image: req.body.image || "",
            description: req.body.description || ""
        };

        ilanlar.push(yeniIlan);

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(ilanlar, null, 2),
            "utf8"
        );

        res.json({
            success: true,
            ilan: yeniIlan
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "İlan kaydedilemedi."
        });
    }
});

// ===============================
// İLAN SİL
// ===============================
app.delete("/api/ilanlar/:id", (req, res) => {
    try {
        const ilanlar = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

        const id = Number(req.params.id);

        const yeniListe = ilanlar.filter(
            ilan => Number(ilan.id) !== id
        );

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(yeniListe, null, 2),
            "utf8"
        );

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "İlan silinemedi."
        });
    }
});

// ===============================
// İLAN DÜZENLE
// ===============================
app.put("/api/ilanlar/:id", (req, res) => {
    try {
        const ilanlar = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

        const id = Number(req.params.id);

        const index = ilanlar.findIndex(
            ilan => Number(ilan.id) === id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: "İlan bulunamadı."
            });
        }

        ilanlar[index] = {
            ...ilanlar[index],
            ...req.body,
            id: id
        };

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(ilanlar, null, 2),
            "utf8"
        );

        res.json({
            success: true,
            ilan: ilanlar[index]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "İlan düzenlenemedi."
        });
    }
});

// ===============================
// SUNUCUYU BAŞLAT
// ===============================
app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Nova Emlak sunucusu ${PORT} portunda çalışıyor.`
    );
});