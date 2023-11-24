import { Injectable } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AnalyzeDocumentService {
  private readonly client: DocumentAnalysisClient;

  constructor() {
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const credential = new AzureKeyCredential(
      process.env.FORM_RECOGNIZER_API_KEY,
    );
    this.client = new DocumentAnalysisClient(endpoint, credential);
  }

  async analyzeDocument(imageName: string): Promise<{ [key: string]: any }[]> {
    const readStream = fs.createReadStream(
      path.join('src/public/image/', imageName),
    );
    const modelId = process.env.CUSTOM_MODEL_ID;

    console.log(`Analyzing document using model ID ${modelId}...`);

    const poller = await this.client.beginAnalyzeDocument(modelId, readStream);
    const result = await poller.pollUntilDone();

    if (!result.documents || result.documents.length === 0) {
      throw new Error('Expected at least one document in the result.');
    }

    return result.documents.map((document) => {
      const documentResult: { [key: string]: any } = {};
      Object.entries(document.fields).forEach(([name, field]) => {
        documentResult[name] = field.content;
      });
      return documentResult;
    });
  }
}
