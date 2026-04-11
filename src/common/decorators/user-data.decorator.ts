import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Extrae el usuario inyectado por el JwtStrategy / FetchUserInterceptor.
 * Uso:
 *   @Get()
 *   list(@UserData('userId') userId: string) { ... }
 */
export const UserData = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userData = request.userData;
    if (userData && data && userData[data] !== undefined) return userData[data];

    const user = request.user;
    if (user) return data ? user[data] : user;
    return null;
  },
);
