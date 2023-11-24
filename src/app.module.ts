import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AzureController } from './azure/azure.controller';
import { AzureService } from './azure/azure.service';
import { ClassifyDocumentService } from './azure/classify-document/classify-document.service';
import { AnalyzeDocumentService } from './azure/analyze-document/analyze-document.service';
import { AnalyzePassportService } from './azure/analyze-passport/analyse-passport.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AzureController],
  providers: [
    AppService,
    AzureService,
    ClassifyDocumentService,
    AnalyzeDocumentService,
    AnalyzePassportService,
  ],
})
export class AppModule {}
