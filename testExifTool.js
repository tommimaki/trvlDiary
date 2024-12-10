const { ExifTool } = require("exiftool-vendored");
const path = require("path");

const exiftool = new ExifTool();

(async () => {
  const testImagePath = path.resolve("./public/uploads/testpic.png");
  console.log(`Reading metadata for ${testImagePath}...`);

  try {
    const metadata = await exiftool.read(testImagePath);
    console.log("Extracted Metadata:", metadata);
  } catch (error) {
    console.error("Error extracting metadata:", error.message);
    console.error("Full error object:", error);
  } finally {
    await exiftool.end();
    console.log("ExifTool process ended.");
  }
})();
