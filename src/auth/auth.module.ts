import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { jwtConstants } from "./constants";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    EmailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
