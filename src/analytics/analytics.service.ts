import { Injectable } from "@nestjs/common";

/**
 * KPIs / estadísticas del laboratorio.
 * TODO: implementar agregaciones reales contra MongoDB.
 */
@Injectable()
export class AnalyticsService {
  async overview() {
    return {
      reservationsThisMonth: 0,
      pendingApprovals: 0,
      mostRequestedReagents: [],
      mostUsedEquipments: [],
      activeStudents: 0,
    };
  }
}
