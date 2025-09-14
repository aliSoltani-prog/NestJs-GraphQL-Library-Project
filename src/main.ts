import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlThrottlerGuard } from './guards/costum-guard/costum-guard.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors();

  // Global validation pipe (optional but recommended)
  app.useGlobalPipes(new ValidationPipe());

  // Apply the custom GraphQL-aware throttler guard globally
  app.useGlobalGuards(app.get(GqlThrottlerGuard));

  await app.listen(3000);
  console.log(`🚀 Server is running on http://localhost:3000/graphql`);
}
bootstrap();
