import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpServer();
  server.setTimeout(50000); // Thiết lập timeout là 5000 ms

  await app.listen(3000);
}
bootstrap();
