// pages/api/share-report.js
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const writeFile = promisify(fs.writeFile);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { message, pdfData, phoneNumber, fileName } = req.body;

    // Create temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Generate unique filename
    const uniqueFileName = `${uuidv4()}_${fileName}`;
    const filePath = path.join(tempDir, uniqueFileName);

    // Save PDF file
    const base64Data = pdfData.replace(/^data:application\/pdf;base64,/, "");
    await writeFile(filePath, base64Data, "base64");

    // Generate WhatsApp URL
    // Note: You'll need to implement your own logic here to actually send the file
    // This could involve using WhatsApp Business API or other methods
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Clean up: Delete the temporary file after a delay
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }, 5000);

    return res.status(200).json({
      success: true,
      whatsappUrl,
      filePath: uniqueFileName,
    });
  } catch (error) {
    console.error("Error in share-report API:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process report sharing",
    });
  }
}
