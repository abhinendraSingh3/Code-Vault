import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:["http://localhost:5173",
      "https://code-vault-2.onrender.com" //this is the render frontend 
    ]

  });

  const configService=app.get(ConfigService);


  const PORT=configService.get<string>('PORT','3000')

  await app.listen(PORT);
console.log(`App is running on http://localhost:${PORT}`);}
bootstrap();
   