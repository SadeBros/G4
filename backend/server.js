const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const port = process.env.PORT || 5000;

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.post("/", (req, res) => {
  const markers = req.body.markers;
  let fileContent = markers.map(el => {
    const str = "" + el.lat + "," + el.lng;
    return str;
  });

  const filePath = "./missions/";
  const fileName = "output.txt";
  const fullPath = filePath + fileName;

  fileContent = ['lat,lng',...fileContent];
  fileContent = fileContent.join('\n');

  fs.writeFile(fullPath, fileContent, err => {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});
