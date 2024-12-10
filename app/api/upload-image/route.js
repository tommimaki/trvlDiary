// import { NextResponse } from "next/server";
// import cloudinary from "@/utils/cloudinary";
// import streamifier from "streamifier";

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser to handle 'multipart/form-data'
//   },
// };

// export async function POST(request) {
//   console.log("called image upload"), request;
//   try {
//     // Parse the form data using the native formData() method
//     const formData = await request.formData();

//     // Extract the file from the form data; ensure the input field name is 'image'
//     const file = formData.get("image");

//     if (!file) {
//       return NextResponse.json(
//         { error: "No image file provided" },
//         { status: 400 }
//       );
//     }

//     // Read the file data into a Buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Optional: Validate file type and size
//     const validTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (!validTypes.includes(file.type)) {
//       return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
//     }

//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (buffer.length > maxSize) {
//       return NextResponse.json(
//         { error: "File size exceeds limit (5MB)" },
//         { status: 400 }
//       );
//     }

//     // Upload the image to Cloudinary using a stream
//     const uploadResult = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: "forms_uploads" }, // Optional: specify a folder
//         (error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         }
//       );

//       // Convert Buffer to Stream and pipe to Cloudinary
//       streamifier.createReadStream(buffer).pipe(uploadStream);
//     });

//     // Respond with the image URL
//     return NextResponse.json(
//       {
//         imageUrl: uploadResult.secure_url,
//         publicId: uploadResult.public_id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);
//     return NextResponse.json(
//       { error: "Error uploading image" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import {
//   saveFileToProjectDirectory,
//   extractMetadata,
//   uploadToCloudinary,
// } from "@/utils/fileHandlers";

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser to handle 'multipart/form-data'
//   },
// };

// export async function POST(request) {
//   console.log("Image upload API called");

//   try {
//     // Parse the form data
//     const formData = await request.formData();
//     const file = formData.get("image");

//     if (!file) {
//       console.warn("No image file provided in form data");
//       return NextResponse.json(
//         { error: "No image file provided" },
//         { status: 400 }
//       );
//     }

//     console.log(`Received file: ${file.name}, type: ${file.type}`);
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Validate file type and size
//     const validTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (!validTypes.includes(file.type)) {
//       console.warn(`Invalid file type: ${file.type}`);
//       return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
//     }

//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (buffer.length > maxSize) {
//       console.warn("File size exceeds limit (5MB)");
//       return NextResponse.json(
//         { error: "File size exceeds limit (5MB)" },
//         { status: 400 }
//       );
//     }

//     // Save file to the project directory
//     const savedFilePath = await saveFileToProjectDirectory(file, buffer);

//     // Extract metadata
//     const metadata = await extractMetadata(savedFilePath);

//     // Upload image to Cloudinary
//     const uploadResult = await uploadToCloudinary(buffer);

//     // Respond with the image URL, public ID, and metadata
//     return NextResponse.json(
//       {
//         imageUrl: uploadResult.secure_url,
//         publicId: uploadResult.public_id,
//         metadata,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in image upload flow:", error.message);
//     return NextResponse.json(
//       { error: "Error in image upload flow" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import {
  extractMetadataFromCloudinary,
  uploadToCloudinary,
} from "@/utils/fileHandlers";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle 'multipart/form-data'
  },
};

export async function POST(request) {
  console.log("Image upload API called");

  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      console.warn("No image file provided in form data");
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    console.log(`Received file: ${file.name}, type: ${file.type}`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      console.warn(`Invalid file type: ${file.type}`);
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.length > maxSize) {
      console.warn("File size exceeds limit (5MB)");
      return NextResponse.json(
        { error: "File size exceeds limit (5MB)" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer);
    console.log("Uploaded image to Cloudinary:", uploadResult);

    // Extract metadata from the uploaded image
    const metadata = await extractMetadataFromCloudinary(
      uploadResult.public_id
    );

    // Respond with the image URL, public ID, and metadata
    return NextResponse.json(
      {
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        metadata,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in image upload flow:", error.message);
    return NextResponse.json(
      { error: "Error in image upload flow" },
      { status: 500 }
    );
  }
}
