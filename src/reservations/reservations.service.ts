import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { SpaceReservation } from "./space-reservation.entity";
import { EquipmentReservation } from "./equipment-reservation.entity";
import { ReagentRequest } from "./reagent-request.entity";
import { CreateSpaceReservationDto } from "./dto/create-space-reservation.dto";
import { CreateEquipmentReservationDto } from "./dto/create-equipment-reservation.dto";
import { CreateReagentRequestDto } from "./dto/create-reagent-request.dto";
import { NotificationsService } from "../notifications/notifications.service";

/**
 * Servicio unificado de reservas:
 *  - Espacios (slot horario)
 *  - Equipos (slot horario)
 *  - Reactivos (consumible, sin slot)
 *
 * Flujo: pending → approved/rejected. Solo aprobadas bloquean slots.
 * En cada cambio de estado se notifica al admin (email + WhatsApp + WS)
 * vía NotificationsService.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(SpaceReservation)
    private readonly spacesRepo: MongoRepository<SpaceReservation>,
    @InjectRepository(EquipmentReservation)
    private readonly equipsRepo: MongoRepository<EquipmentReservation>,
    @InjectRepository(ReagentRequest)
    private readonly reagentsRepo: MongoRepository<ReagentRequest>,
    private readonly notifications: NotificationsService,
  ) {}

  // -------- ESPACIOS --------
  async createSpaceReservation(userId: string, dto: CreateSpaceReservationDto) {
    // TODO: validar que los timeBlocks no choquen con otra reserva APROBADA
    const reservation = this.spacesRepo.create({
      userId,
      spaceId: dto.spaceId,
      date: new Date(dto.date),
      timeBlocks: dto.timeBlocks,
      notes: dto.notes,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.spacesRepo.save(reservation);
    await this.notifications.notifyNewSpaceReservation(saved);
    return saved;
  }

  listSpaceReservations(filter: { userId?: string; status?: string } = {}) {
    return this.spacesRepo.find({ where: filter as any });
  }

  async approveSpaceReservation(id: string, adminId: string) {
    const r = await this.spacesRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Reserva de espacio no encontrada");
    r.status = "approved";
    r.resolvedBy = adminId;
    r.updatedAt = new Date();
    const saved = await this.spacesRepo.save(r);
    await this.notifications.notifyReservationResolved("space", saved);
    return saved;
  }

  async rejectSpaceReservation(id: string, adminId: string, reason?: string) {
    const r = await this.spacesRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Reserva de espacio no encontrada");
    r.status = "rejected";
    r.resolvedBy = adminId;
    r.rejectionReason = reason;
    r.updatedAt = new Date();
    const saved = await this.spacesRepo.save(r);
    await this.notifications.notifyReservationResolved("space", saved);
    return saved;
  }

  // -------- EQUIPOS --------
  async createEquipmentReservation(
    userId: string,
    dto: CreateEquipmentReservationDto,
  ) {
    const reservation = this.equipsRepo.create({
      userId,
      equipmentId: dto.equipmentId,
      date: new Date(dto.date),
      timeBlocks: dto.timeBlocks,
      notes: dto.notes,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.equipsRepo.save(reservation);
    await this.notifications.notifyNewEquipmentReservation(saved);
    return saved;
  }

  listEquipmentReservations(filter: { userId?: string; status?: string } = {}) {
    return this.equipsRepo.find({ where: filter as any });
  }

  async approveEquipmentReservation(id: string, adminId: string) {
    const r = await this.equipsRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Reserva de equipo no encontrada");
    r.status = "approved";
    r.resolvedBy = adminId;
    r.updatedAt = new Date();
    const saved = await this.equipsRepo.save(r);
    await this.notifications.notifyReservationResolved("equipment", saved);
    return saved;
  }

  async rejectEquipmentReservation(id: string, adminId: string, reason?: string) {
    const r = await this.equipsRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Reserva de equipo no encontrada");
    r.status = "rejected";
    r.resolvedBy = adminId;
    r.rejectionReason = reason;
    r.updatedAt = new Date();
    const saved = await this.equipsRepo.save(r);
    await this.notifications.notifyReservationResolved("equipment", saved);
    return saved;
  }

  // -------- REACTIVOS --------
  async createReagentRequest(userId: string, dto: CreateReagentRequestDto) {
    if (dto.quantity <= 0) {
      throw new BadRequestException("Cantidad debe ser mayor a 0");
    }
    const request = this.reagentsRepo.create({
      userId,
      reagentId: dto.reagentId,
      quantity: dto.quantity,
      unit: dto.unit,
      justification: dto.justification,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.reagentsRepo.save(request);
    await this.notifications.notifyNewReagentRequest(saved);
    return saved;
  }

  listReagentRequests(filter: { userId?: string; status?: string } = {}) {
    return this.reagentsRepo.find({ where: filter as any });
  }

  async approveReagentRequest(id: string, adminId: string) {
    const r = await this.reagentsRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Solicitud de reactivo no encontrada");
    r.status = "approved";
    r.resolvedBy = adminId;
    r.updatedAt = new Date();
    const saved = await this.reagentsRepo.save(r);
    // TODO: descontar quantity del Reagent en inventario
    await this.notifications.notifyReservationResolved("reagent", saved);
    return saved;
  }

  async rejectReagentRequest(id: string, adminId: string, reason?: string) {
    const r = await this.reagentsRepo.findOneBy({ _id: new ObjectId(id) });
    if (!r) throw new NotFoundException("Solicitud de reactivo no encontrada");
    r.status = "rejected";
    r.resolvedBy = adminId;
    r.rejectionReason = reason;
    r.updatedAt = new Date();
    const saved = await this.reagentsRepo.save(r);
    await this.notifications.notifyReservationResolved("reagent", saved);
    return saved;
  }
}
