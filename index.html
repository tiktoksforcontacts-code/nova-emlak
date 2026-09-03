```js
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "ilanlar.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

/* =========================
SITE AYARI
========================= */

const SITE_URL = (
    process.env.SITE_URL ||
    "https://nova-emlak.onrender.com"
).replace(/\/$/, "");

/* =========================
BODY AYARLARI
========================= */

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

/* =========================
ROBOTS.TXT
========================= */

app.get("/robots.txt", (req, res) => {

    const robots = `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /api/
Disallow: /uploads/

Sitemap: ${SITE_URL}/sitemap.xml
`;

    res
        .status(200)
        .set("Content-Type", "text/plain; charset=utf-8")
        .send(robots);

});

/* =========================
SITEMAP.XML
========================= */

function escapeXml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}

app.get("/sitemap.xml", (req, res) => {

    try {

        let ilanlar = [];

        if (fs.existsSync(DATA_FILE)) {

            try {

                const data = fs.readFileSync(
                    DATA_FILE,
                    "utf8"
                );

                const parsed = JSON.parse(data);

                if (Array.isArray(parsed)) {
                    ilanlar = parsed;
                }

            } catch (error) {

                console.error(
                    "Sitemap ilan verisi okuma hatası:",
                    error
                );

                ilanlar = [];

            }

        }

        const urls = [];

        /* ANA SAYFA */

        urls.push(`
    <url>
        <loc>${escapeXml(SITE_URL + "/")}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`);

        /* İLANLAR SAYFASI */

        urls.push(`
    <url>
        <loc>${escapeXml(SITE_URL + "/ilan.html")}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`);

        /* TÜM İLANLAR */

        if (Array.isArray(ilanlar)) {

            ilanlar.forEach((ilan) => {

                if (
                    !ilan ||
                    ilan.id === undefined ||
                    ilan.id === null
                ) {
                    return;
                }

                const ilanUrl =
                    SITE_URL +
                    "/ilan.html?id=" +
                    encodeURIComponent(
                        String(ilan.id)
                    );

                urls.push(`
    <url>
        <loc>${escapeXml(ilanUrl)}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`);

            });

        }

        /* XML */

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`;

        res
            .status(200)
            .set(
                "Content-Type",
                "application/xml; charset=utf-8"
            )
            .send(sitemap);

    } catch (error) {

        console.error(
            "Sitemap oluşturma hatası:",
            error
        );

        res
            .status(500)
            .set(
                "Content-Type",
                "text/plain; charset=utf-8"
            )
            .send(
                "Sitemap oluşturulamadı."
            );

    }

});

/* =========================
STATİK DOSYALAR
========================= */

app.use(
    express.static(__dirname)
);

/* =========================
KLASÖRLER
========================= */

if (!fs.existsSync(DATA_FILE)) {

    fs.writeFileSync(
        DATA_FILE,
        "[]",
        "utf8"
    );

}

if (!fs.existsSync(UPLOADS_DIR)) {

    fs.mkdirSync(
        UPLOADS_DIR,
        {
            recursive: true
        }
    );

}

/* =========================
FOTOĞRAF YÜKLEME
========================= */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            UPLOADS_DIR
        );

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(
                file.originalname
            );

        const filename =
            Date.now() +
            "-" +
            crypto.randomBytes(6).toString("hex") +
            extension;

        cb(
            null,
            filename
        );

    }

});

const upload = multer({

    storage: storage,

    limits: {
        files: 4,
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        if (
            file.mimetype &&
            file.mimetype.startsWith("image/")
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Sadece resim dosyaları yüklenebilir."
                )
            );

        }

    }

});

/* =========================
ADMIN OTURUMLARI
========================= */

const adminTokens = new Set();

/* =========================
ADMIN GİRİŞ
========================= */

app.post(
    "/api/admin-login",
    (req, res) => {

        const password =
            req.body.password;

        if (
            process.env.ADMIN_PASSWORD &&
            password === process.env.ADMIN_PASSWORD
        ) {

            const token =
                crypto
                    .randomBytes(32)
                    .toString("hex");

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

    }
);

/* =========================
ADMIN KONTROL
========================= */

function requireAdmin(
    req,
    res,
    next
) {

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
            error:
                "Oturum geçersiz veya süresi dolmuş."

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

        const auth =
            req.headers.authorization || "";

        const token =
            auth.substring(7);

        adminTokens.delete(token);

        res.json({

            success: true

        });

    }
);

/* =========================
İLANLARI GETİR
========================= */

app.get(
    "/api/ilanlar",
    (req, res) => {

        try {

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

            res.json(
                ilanlar
            );

        } catch (error) {

            console.error(
                "İlanları okuma hatası:",
                error
            );

            res.status(500).json({

                success: false,
                error: "İlanlar okunamadı."

            });

        }

    }
);

/* =========================
İLAN EKLE
========================= */

app.post(
    "/api/ilanlar",
    requireAdmin,
    upload.array("images", 4),
    (req, res) => {

        try {

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

            let images = [];

            if (
                req.files &&
                req.files.length > 0
            ) {

                images =
                    req.files
                        .slice(0, 4)
                        .map(
                            file =>
                                "/uploads/" +
                                file.filename
                        );

            }

            if (
                images.length === 0 &&
                req.body.images
            ) {

                try {

                    const bodyImages =
                        typeof req.body.images === "string"
                            ? JSON.parse(req.body.images)
                            : req.body.images;

                    if (
                        Array.isArray(bodyImages)
                    ) {

                        images =
                            bodyImages
                                .filter(Boolean)
                                .slice(0, 4);

                    }

                } catch (error) {

                    console.log(
                        "images okunamadı."
                    );

                }

            }

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

                images: images,

                image:
                    images[0] || "",

                description:
                    req.body.description || ""

            };

            ilanlar.push(
                yeniIlan
            );

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

            console.error(
                "İlan ekleme hatası:",
                error
            );

            res.status(500).json({

                success: false,
                error: "İlan eklenemedi."

            });

        }

    }
);

/* =========================
İLAN GÜNCELLE
========================= */

app.put(
    "/api/ilanlar/:id",
    requireAdmin,
    upload.array("images", 4),
    (req, res) => {

        try {

            const id =
                Number(req.params.id);

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

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

            let images =
                Array.isArray(
                    ilanlar[index].images
                )
                    ? ilanlar[index].images
                    : (
                        ilanlar[index].image
                            ? [ilanlar[index].image]
                            : []
                    );

            if (
                req.files &&
                req.files.length > 0
            ) {

                images =
                    req.files
                        .slice(0, 4)
                        .map(
                            file =>
                                "/uploads/" +
                                file.filename
                        );

            }

            ilanlar[index] = {

                ...ilanlar[index],

                title:
                    req.body.title ??
                    ilanlar[index].title,

                type:
                    req.body.type ??
                    ilanlar[index].type,

                city:
                    req.body.city ??
                    ilanlar[index].city,

                district:
                    req.body.district ??
                    ilanlar[index].district,

                neighborhood:
                    req.body.neighborhood ??
                    ilanlar[index].neighborhood,

                price:
                    req.body.price !== undefined
                        ? Number(req.body.price) || 0
                        : ilanlar[index].price,

                rooms:
                    req.body.rooms ??
                    ilanlar[index].rooms,

                area:
                    req.body.area !== undefined
                        ? Number(req.body.area) || 0
                        : ilanlar[index].area,

                buildingAge:
                    req.body.buildingAge !== undefined
                        ? Number(req.body.buildingAge) || 0
                        : ilanlar[index].buildingAge,

                floor:
                    req.body.floor ??
                    ilanlar[index].floor,

                totalFloors:
                    req.body.totalFloors !== undefined
                        ? Number(req.body.totalFloors) || 0
                        : ilanlar[index].totalFloors,

                heating:
                    req.body.heating ??
                    ilanlar[index].heating,

                bathrooms:
                    req.body.bathrooms ??
                    ilanlar[index].bathrooms,

                balcony:
                    req.body.balcony ??
                    ilanlar[index].balcony,

                credit:
                    req.body.credit ??
                    ilanlar[index].credit,

                deed:
                    req.body.deed ??
                    ilanlar[index].deed,

                images: images,

                image:
                    images[0] ||
                    ilanlar[index].image ||
                    "",

                description:
                    req.body.description ??
                    ilanlar[index].description

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

            console.error(
                "İlan güncelleme hatası:",
                error
            );

            res.status(500).json({

                success: false,
                error: "İlan güncellenemedi."

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

            const id =
                Number(req.params.id);

            const ilanlar =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );

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

            const deleted =
                ilanlar.splice(
                    index,
                    1
                )[0];

            const images =
                Array.isArray(deleted.images)
                    ? deleted.images
                    : (
                        deleted.image
                            ? [deleted.image]
                            : []
                    );

            images.forEach(
                image => {

                    if (
                        typeof image !== "string"
                    ) {
                        return;
                    }

                    if (
                        !image.startsWith("/uploads/")
                    ) {
                        return;
                    }

                    const filename =
                        path.basename(image);

                    const filePath =
                        path.join(
                            UPLOADS_DIR,
                            filename
                        );

                    if (
                        fs.existsSync(filePath)
                    ) {

                        try {

                            fs.unlinkSync(
                                filePath
                            );

                        } catch (error) {

                            console.log(
                                "Fotoğraf silinemedi:",
                                error.message
                            );

                        }

                    }

                }
            );

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
                ilan: deleted

            });

        } catch (error) {

            console.error(
                "İlan silme hatası:",
                error
            );

            res.status(500).json({

                success: false,
                error: "İlan silinemedi."

            });

        }

    }
);

/* =========================
HATA YAKALAMA
========================= */

app.use(
    (error, req, res, next) => {

        console.error(error);

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code === "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    success: false,
                    error:
                        "Fotoğraf boyutu en fazla 10 MB olabilir."

                });

            }

            if (
                error.code === "LIMIT_FILE_COUNT"
            ) {

                return res.status(400).json({

                    success: false,
                    error:
                        "En fazla 4 fotoğraf yükleyebilirsiniz."

                });

            }

            return res.status(400).json({

                success: false,
                error:
                    "Fotoğraf yükleme hatası."

            });

        }

        if (
            error &&
            error.message ===
            "Sadece resim dosyaları yüklenebilir."
        ) {

            return res.status(400).json({

                success: false,
                error: error.message

            });

        }

        res.status(500).json({

            success: false,
            error: "Sunucu hatası."

        });

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
            "Nova Emlak sunucusu çalışıyor. PORT: " +
            PORT
        );

        console.log(
            "Site URL: " +
            SITE_URL
        );

        console.log(
            "Robots: " +
            SITE_URL +
            "/robots.txt"
        );

        console.log(
            "Sitemap: " +
            SITE_URL +
            "/sitemap.xml"
        );

    }
);
```
