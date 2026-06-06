import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { SearchModule } from './search/search.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { BlogModule } from './blog/blog.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: (config.get('RATE_LIMIT_TTL', 60)) * 1000,
            limit: config.get('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        prismaOptions: {
          datasources: { db: { url: config.get('DATABASE_URL') } },
          log: config.get('NODE_ENV') === 'development' ? ['query', 'info', 'warn'] : ['error'],
        },
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    PaymentsModule,
    UploadModule,
    EmailModule,
    SearchModule,
    ReviewsModule,
    WishlistModule,
    CouponsModule,
    CategoriesModule,
    NotificationsModule,
    AdminModule,
    LoyaltyModule,
    BlogModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
