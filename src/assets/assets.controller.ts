import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import * as QRCode from "qrcode";
import { ReagentsService } from "../reagents/reagents.service";
import { MaterialsService } from "../materials/materials.service";
import { EquipmentsService } from "../equipments/equipments.service";

/**
 * Endpoints públicos relacionados con assetCode:
 *  - GET /assets/:code              → información pública del activo (para QR scan)
 *  - GET /assets/:code/qr           → PNG del código QR (redirige a /activo/:code del frontend)
 *  - GET /assets/:code/qr?format=svg→ SVG del QR
 */
@ApiTags("assets")
@Controller("assets")
export class AssetsController {
  constructor(
    private readonly reagents: ReagentsService,
    private readonly materials: MaterialsService,
    private readonly equipments: EquipmentsService,
  ) {}

  @Get(":code")
  async findByCode(@Param("code") code: string) {
    const prefix = code.split("-")[0]?.toUpperCase();
    let item: any = null;
    let type: string | null = null;

    if (prefix === "REAC") {
      item = await this.reagents.findByAssetCode(code);
      type = "reagent";
    } else if (prefix === "MAT") {
      item = await this.materials.findByAssetCode(code);
      type = "material";
    } else if (prefix === "EQUIP") {
      item = await this.equipments.findByAssetCode(code);
      type = "equipment";
    }

    if (!item) throw new NotFoundException("Activo no encontrado");

    // Respuesta pública con datos no sensibles
    return {
      assetCode: item.assetCode,
      type,
      name: item.name,
      description: item.description ?? null,
      category: item.category ?? null,
      formula: item.formula ?? null,
      casNumber: item.casNumber ?? null,
      brand: item.brand ?? null,
      model: item.model ?? null,
      serialNumber: item.serialNumber ?? null,
      status: item.status ?? null,
      hazardClass: item.hazardClass ?? null,
      location: item.location ?? null,
      quantity: item.quantity ?? null,
      unit: item.unit ?? null,
      lowStock:
        item.lowStockThreshold !== undefined &&
        item.quantity !== undefined &&
        item.quantity < item.lowStockThreshold,
    };
  }

  @Get(":code/qr")
  async generateQR(
    @Param("code") code: string,
    @Query("format") format: "png" | "svg" = "png",
    @Query("size") sizeStr = "300",
    @Res() res: Response,
  ) {
    const size = Math.min(800, Math.max(100, parseInt(sizeStr, 10) || 300));
    const baseUrl =
      process.env.FRONTEND_URL || "https://unimetlabs.lat";
    const target = `${baseUrl}/activo/${encodeURIComponent(code)}`;

    if (format === "svg") {
      const svg = await QRCode.toString(target, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: "#003087", light: "#FFFFFF" },
      });
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(svg);
      return;
    }

    const png = await QRCode.toBuffer(target, {
      type: "png",
      width: size,
      margin: 2,
      color: { dark: "#003087", light: "#FFFFFF" },
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(png);
  }
}
