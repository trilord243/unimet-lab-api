import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import * as crypto from "crypto";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";

/**
 * Servicio de autenticación: validación de credenciales (PBKDF2),
 * registro con verificación por email y emisión de JWT.
 *
 * Estilo idéntico a centromundox: email + contraseña + verificación.
 * Validación de dominio institucional UNIMET en el registro:
 *   - @unimet.edu.ve         → role: "professor"
 *   - @correo.unimet.edu.ve  → role: "student"
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Hash de password con PBKDF2 + salt aleatorio (formato salt$hash) */
  static hashPassword(plain: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(plain, salt, 10000, 64, "sha512")
      .toString("hex");
    return `${salt}$${hash}`;
  }

  /** Determina rol según dominio del correo institucional UNIMET */
  static resolveRoleFromEmail(
    email: string,
  ): "student" | "professor" | null {
    const lower = email.toLowerCase().trim();
    if (lower.endsWith("@correo.unimet.edu.ve")) return "student";
    if (lower.endsWith("@unimet.edu.ve")) return "professor";
    return null;
  }

  async validateUserByPassword(
    email: string,
    password: string,
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    let passwordMatches = false;
    if (user.password.includes("$")) {
      const [salt, storedHash] = user.password.split("$");
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      passwordMatches = storedHash === hash;
    } else {
      passwordMatches = user.password === password;
    }
    if (!passwordMatches) return null;

    if (!user.emailVerified) {
      throw new UnauthorizedException({
        message:
          "Por favor verifica tu correo electrónico antes de iniciar sesión",
        errorCode: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: Omit<User, "password">) {
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /** Registro restringido por dominio UNIMET. */
  async register(input: {
    name: string;
    email: string;
    password: string;
  }) {
    const role = AuthService.resolveRoleFromEmail(input.email);
    if (!role) {
      throw new BadRequestException(
        "Solo se permiten correos institucionales @unimet.edu.ve o @correo.unimet.edu.ve",
      );
    }

    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new BadRequestException("Ya existe un usuario con ese correo");
    }

    const hashed = AuthService.hashPassword(input.password);
    const user = await this.usersService.create({
      name: input.name,
      email: input.email,
      password: hashed,
      role,
      emailVerified: false,
    });

    // TODO: Disparar correo de verificación con código (EmailService)
    return {
      message: "Usuario creado. Revisa tu correo para verificar la cuenta.",
      userId: user._id.toString(),
      role: user.role,
    };
  }
}
