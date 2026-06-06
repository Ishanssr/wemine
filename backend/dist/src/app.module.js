"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const nestjs_prisma_1 = require("nestjs-prisma");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const cart_module_1 = require("./cart/cart.module");
const payments_module_1 = require("./payments/payments.module");
const upload_module_1 = require("./upload/upload.module");
const email_module_1 = require("./email/email.module");
const search_module_1 = require("./search/search.module");
const reviews_module_1 = require("./reviews/reviews.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const coupons_module_1 = require("./coupons/coupons.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
const admin_module_1 = require("./admin/admin.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
const blog_module_1 = require("./blog/blog.module");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [
                        {
                            ttl: (config.get('RATE_LIMIT_TTL', 60)) * 1000,
                            limit: config.get('RATE_LIMIT_MAX', 100),
                        },
                    ],
                }),
            }),
            nestjs_prisma_1.PrismaModule.forRootAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    prismaOptions: {
                        datasources: { db: { url: config.get('DATABASE_URL') } },
                        log: config.get('NODE_ENV') === 'development' ? ['query', 'info', 'warn'] : ['error'],
                    },
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            cart_module_1.CartModule,
            payments_module_1.PaymentsModule,
            upload_module_1.UploadModule,
            email_module_1.EmailModule,
            search_module_1.SearchModule,
            reviews_module_1.ReviewsModule,
            wishlist_module_1.WishlistModule,
            coupons_module_1.CouponsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            loyalty_module_1.LoyaltyModule,
            blog_module_1.BlogModule,
            chat_module_1.ChatModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map