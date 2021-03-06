const { google } = require("googleapis");
const fs = require("fs");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2client,
});

const uploadFile = async (Filepath, mimeType) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "blog-app",
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(Filepath),
      },
    });
    await generateLink(response.data.id);
    return { response: response.data };
  } catch (err) {
    return false;
  }
};

const generateLink = async (id) => {
  try {
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    await drive.files.get({
      fileId: id,
      fields: "webViewLink webContentLink",
    });
    return;
  } catch (err) {
    return false;
  }
};

const deleteFile = async (id) => {
  try {
    await drive.files.delete({
      fileId: id,
    });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { uploadFile, deleteFile };
