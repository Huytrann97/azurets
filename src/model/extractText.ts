import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function analyzeDocumentWithModelId() {
  const envFilePath = 'azurets/.env';
  dotenv.config({ path: envFilePath });

  const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
  const credential = new AzureKeyCredential(
    process.env.FORM_RECOGNIZER_API_KEY,
  );
  const client = new DocumentAnalysisClient(endpoint, credential);
  const modelId = process.env.CUSTOM_MODEL_ID;

  // Đường dẫn và tên tệp ảnh
  const path = 'azurets/src/public/image/';
  const imageName = 'image.jpg';
  const readStream = fs.createReadStream(path + imageName);

  console.log(`Analyzing document using model ID ${modelId}...`);

  const poller = await client.beginAnalyzeDocument(modelId, readStream);
  const { documents } = await poller.pollUntilDone();
  const document = documents && documents[0];

  if (!document) {
    throw new Error('Expected at least one document in the result.');
  }

  console.log(
    'Extracted document:',
    document.docType,
    `(confidence: ${document.confidence || '<undefined>'})`,
  );
  console.log('Fields:', document.fields);
}

// Gọi hàm để thực hiện công việc
analyzeDocumentWithModelId().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
