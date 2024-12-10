// import { exiftool } from "exiftool-vendored";
// import fs from "fs/promises";
// import fetch from "node-fetch";
// import path from "path";

// export async function POST(req) {
//   try {
//     const { imagePath } = await req.json(); // Expect the Cloudinary URL

//     if (!imagePath) {
//       return new Response(
//         JSON.stringify({ error: "Image path is required." }),
//         { status: 400 }
//       );
//     }

//     // Step 1: Download the image
//     const response = await fetch(imagePath);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch image from ${imagePath}`);
//     }

//     // Step 2: Save the image locally
//     const tempFilePath = path.join(process.cwd(), "temp-image");
//     const buffer = await response.buffer();
//     await fs.writeFile(tempFilePath, buffer);

//     // Step 3: Parse metadata
//     const metadata = await exiftool.read(tempFilePath);

//     // Step 4: Clean up the temporary file
//     await fs.unlink(tempFilePath);

//     // Step 5: Return the metadata
//     return new Response(JSON.stringify(metadata), { status: 200 });
//   } catch (error) {
//     console.error("Error parsing metadata:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to parse metadata." }),
//       { status: 500 }
//     );
//   }
// }
