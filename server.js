const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "ilanlar.json");

app.use(express.json({ limit: "50mb" }));
app.use(express.static(__dirname));

/* =========================
   DOSYA
========================= */

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

/* =========================
   ADMIN OTURUMU
========================= */

const adminTokens = new Set();

/* =========================
   ADMIN GİRİŞ
========================= */

app.post("/api/admin-login", (req, res) => {

    const password = req.body.password;

    if (
        process.env.ADMIN_PASSWORD &&
        password === process.env.ADMIN_PASSWORD
    ) {

        const token =
            crypto.randomBytes(32).toString("hex");

        adminTokens.add(token);

        return res.json({
            success: true,
            token: token
        });
    }

    return res.status(401).json({
        success: false,
        error: "Şifre hatalı."
    });
});

/* =========================
   ADMIN KONTROL
========================= */

function requireAdmin(req, res, next) {

    const auth =
        req.headers.authorization || "";

    if (!auth.startsWith("Bearer ")) {

        return res.status(401).json({
            success: false,
            error: "Admin girişi gerekli."
        });
    }

    const token =
        auth.substring(7);

    if (!adminTokens.has(token)) {

        return res.status(401).json({
            success: false,
            error: "Oturum geçersiz veya süresi dolmuş."
        });
    }

    next();
}

/* =========================
   ADMIN ÇIKIŞ
========================= */

app.post(
    "/api/admin-logout",
    requireAdmin,
    (req, res) => {

        const token =
            req.headers.authorization.substring(7);

        adminTokens.delete(token);

        res.json({
            success: true
        });
    }
);

/* =========================
   İLANLARI GETİR
========================= */

app.get("/api/ilanlar", (req, res) => {

    try {

        const ilanlar =
            JSON.parse(
                fs.readFileSync(
                    DATA_FILE,
                    "utf8"
                )
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

/* =========================
   YENİ İLAN EKLE
========================= */

app.post(
    "/api/ilanlar",
    requireAdmin,
    (req, res) => {

        try {

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

            /*
             * FOTOĞRAFLAR
             *
             * Yeni sistem:
             * images: ["foto1", "foto2", "foto3", "foto4"]
             *
             * Eski sistem:
             * image: "foto1"
             */

            let images = [];

            if (
                Array.isArray(req.body.images)
            ) {

                images =
                    req.body.images
                    .filter(Boolean)
                    .slice(0, 4);

            }

            /*
             * Eğer images gönderilmezse
             * eski image alanını kullan.
             */

            if (
                images.length === 0 &&
                req.body.image
            ) {

                images = [
                    req.body.image
                ];
            }

            const yeniIlan = {

                id: Date.now(),

                title:
                    req.body.title || "",

                type:
                    req.body.type || "",

                city:
                    req.body.city || "",

                district:
                    req.body.district || "",

                neighborhood:
                    req.body.neighborhood || "",

                price:
                    Number(req.body.price) || 0,

                rooms:
                    req.body.rooms || "",

                area:
                    Number(req.body.area) || 0,

                buildingAge:
                    Number(req.body.buildingAge) || 0,

                floor:
                    req.body.floor || "",

                totalFloors:
                    Number(req.body.totalFloors) || 0,

                heating:
                    req.body.heating || "",

                bathrooms:
                    req.body.bathrooms || "",

                balcony:
                    req.body.balcony || "",

                credit:
                    req.body.credit || "",

                deed:
                    req.body.deed || "",

                /*
                 * 4 FOTOĞRAF
                 */

                images: images,

                /*
                 * Eski sistemle uyumluluk
                 */

                image:
                    images[0] || "",

                description:
                    req.body.description || ""
            };

            ilanlar.push(yeniIlan);

            fs.writeFileSync(
                DATA_FILE,
                JSON.stringify(
                    ilanlar,
                    null,
                    2
                ),
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
    }
);

/* =========================
   İLAN DÜZENLE
========================= */

app.put(
    "/api/ilanlar/:id",
    requireAdmin,
    (req, res) => {

        try {

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

            const id =
                Number(req.params.id);

            const index =
                ilanlar.findIndex(
                    ilan =>
                        Number(ilan.id) === id
                );

            if (index === -1) {

                return res.status(404).json({
                    success: false,
                    error: "İlan bulunamadı."
                });
            }

            /*
             * Fotoğrafları kontrol et
             */

            let images =
                ilanlar[index].images || [];

            if (
                Array.isArray(req.body.images)
            ) {

                images =
                    req.body.images
                    .filter(Boolean)
                    .slice(0, 4);
            }

            /*
             * Eski ilanlarda sadece image olabilir.
             */

            if (
                images.length === 0 &&
                ilanlar[index].image
            ) {

                images = [
                    ilanlar[index].image
                ];
            }

            ilanlar[index] = {

                ...ilanlar[index],

                ...req.body,

                id: id,

                images: images,

                image:
                    images[0] ||
                    req.body.image ||
                    ilanlar[index].image ||
                    ""
            };

            fs.writeFileSync(
                DATA_FILE,
                JSON.stringify(
                    ilanlar,
                    null,
                    2
                ),
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
    }
);

/* =========================
   İLAN SİL
========================= */

app.delete(
    "/api/ilanlar/:id",
    requireAdmin,
    (req, res) => {

        try {

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

            const id =
                Number(req.params.id);

            const yeniListe =
                ilanlar.filter(
                    ilan =>
                        Number(ilan.id) !== id
                );

            fs.writeFileSync(
                DATA_FILE,
                JSON.stringify(
                    yeniListe,
                    null,
                    2
                ),
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
    }
);

/* =========================
   SUNUCU
========================= */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Nova Emlak sunucusu ${PORT} portunda çalışıyor.`
        );

    }
);