const { exec } = require("child_process");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const fs = require("fs"); // Ensure fs module is required

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Access PRODUCT_ID from environment variables
const PRODUCT_ID = process.env.PRODUCT_ID; // Access environment variable

async function init() {
  console.log("Building...");

  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  p.stderr.on("data", (data) => {
    // Capture error output
    console.error("Error:", data.toString());
  });

  p.on("close", async (data) => {
    console.log("Build completed");

    const distFolderPath = path.join(outDirPath, "dist");

    // Ensure the dist directory exists before reading its contents
    if (fs.existsSync(distFolderPath)) {
      const distFolderContents = fs.readdirSync(distFolderPath, {
        withFileTypes: true,
      });

      for (const file of distFolderContents) {
        const filePath = path.join(distFolderPath, file.name);
        if (file.isDirectory()) {
          continue;
        }

        console.log("Uploading:", filePath);

        const command = new PutObjectCommand({
          Bucket: "vercel-clone-saka015",
          Key: `__outputs/${PRODUCT_ID}/${file.name}`, // Use PRODUCT_ID from env
          Body: fs.createReadStream(filePath),
          ContentType: mime.lookup(filePath),
        });

        try {
          await s3Client.send(command);
          console.log("Uploaded:", filePath);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
        }
      }

      console.log("All files uploaded to S3");
    } else {
      console.error("Dist folder does not exist:", distFolderPath);
    }
  });
}

// Call the init function
init().catch(console.error);
