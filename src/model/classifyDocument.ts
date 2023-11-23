// Import các module và thư viện cần thiết
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';

import * as dotenv from 'dotenv';
const envFilePath = 'azurets/.env'
dotenv.config({ path: envFilePath });

// Khai báo và chạy hàm main
async function main() {
  const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

  const credential = new AzureKeyCredential(
    process.env.FORM_RECOGNIZER_API_KEY ,
  );


  const client = new DocumentAnalysisClient(endpoint, credential);

//   path
const fs = require('fs');
const path = 'azurets/src/public/imageimage.jpg';

const readStream = fs.createReadStream(path);
// 

  const classifierId = process.env.CUSTOM_CLASSIFIER_ID ;
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
  }
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
