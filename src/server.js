const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "Upload OK",
    filename: req.file.filename,
    url: `/file/${req.file.filename}`,
  });
});

app.get("/file/:name", (req, res) => {
  const filePath = path.join(uploadFolder, req.params.name);

  console.log("Looking for:", filePath);

  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  res.download(filePath);
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
