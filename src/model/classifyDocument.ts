// Import các module và thư viện cần thiết
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envFilePath = 'azurets/.env';
dotenv.config({ path: envFilePath });

// Hàm classifyDocument
async function classifyDocument(imageName:string) {
  const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
  const credential = new AzureKeyCredential(
    process.env.FORM_RECOGNIZER_API_KEY,
  );
  const client = new DocumentAnalysisClient(endpoint, credential);
  const path = 'azurets/src/public/image/';

  const readStream = fs.createReadStream(path + imageName);
  const classifierId = process.env.CUSTOM_CLASSIFIER_ID;

  console.log(`Classifying document using classifier ID ${classifierId}...`);

  const poller = await client.beginClassifyDocument(classifierId, readStream, {
    onProgress(state) {
      console.log(`status: ${state.status}`);
    },
  });

  const result = await poller.pollUntilDone();

  if (result.documents === undefined || result.documents.length === 0) {
    throw new Error('Failed to extract any documents.');
  }

  for (const document of result.documents) {
    console.log(
      `Extracted a document with type '${document.docType}' on page ${document.boundingRegions?.[0].pageNumber} (confidence: ${document.confidence})`,
    );
    return document.docType;
  }
}

// Sử dụng hàm classifyDocument
classifyDocument('image.jpg').catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
