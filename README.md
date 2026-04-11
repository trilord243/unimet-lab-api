# UNIMET Lab API

Backend NestJS para el **Laboratorio de Procesos de Separación** de la Universidad Metropolitana.

Inspirado en la arquitectura del proyecto `centromundox-api-reservas`. Mismo stack:
NestJS 11 + TypeORM + MongoDB + Resend + WhatsApp Business API + Socket.IO.

## Requisitos
- Node.js 22.x
- MongoDB local (`mongodb://localhost:27017/unimet-lab`) o MongoDB Atlas
- (Opcional para producción) cuenta de Resend y WhatsApp Business API

## Setup

```bash
npm install
cp .env.example .env
# editar .env con tus credenciales
npm run start:dev
```

API en `http://localhost:3000` — Swagger en `http://localhost:3000/api/docs`.

## Crear el primer superadmin

```bash
node scripts/create-superadmin.js admin@unimet.edu.ve MiClaveSegura123 "Profesor Admin"
```

## Roles

| Rol          | Correo                          | Privilegios |
|--------------|---------------------------------|-------------|
| `student`    | `*@correo.unimet.edu.ve`        | Reservar, solicitar reactivos, ver manuales |
| `professor`  | `*@unimet.edu.ve`               | Aprobar reservas, CRUD inventarios |
| `superadmin` | manual (script)                 | Todo + lab-info público (profesores, normativas) |

Jerarquía: `superadmin > professor > student`.

## Módulos

| Módulo | Descripción |
|---|---|
| `auth` | Login/registro PBKDF2 + JWT, validación de dominio UNIMET |
| `users` | CRUD de usuarios |
| `reagents` | Inventario de reactivos químicos |
| `materials` | Inventario de materiales (vasos, pipetas, etc.) |
| `equipments` | Inventario de equipos (bombas, columnas, etc.) |
| `purchases` | Compras requeridas |
| `research-projects` | Trabajos de investigación |
| `spaces` | Espacios físicos reservables del lab |
| `reservations` | 3 tipos: espacio (slot), equipo (slot), reactivo (consumible) |
| `class-schedule` | Horario de clases del profesor |
| `manuals` | Manuales PDF (metadata + URL al binario) |
| `lab-info` | Profesores y normativas mostrados en landing pública |
| `email` | Resend con plantillas de marca |
| `whatsapp` | Meta Graph API v22 |
| `notifications` | Orquesta email + WhatsApp + WS por evento |
| `websocket` | Socket.IO push al panel del profesor |
| `analytics` | KPIs |

## Bloques horarios

6 bloques de 1h 45min (mismo esquema que centromundox):
07:00-08:45, 08:45-10:30, 10:30-12:15, 12:15-14:00, 14:00-15:45, 15:45-17:30

## Variables de entorno

Ver `.env.example`. Las críticas son `MONGODB_URI`, `JWT_SECRET`,
`RESEND_API_KEY`, `WHATSAPP_API_TOKEN`, `WHATSAPP_BUSINESS_PHONE`,
`ADMIN_NOTIFICATION_EMAIL`, `ADMIN_NOTIFICATION_WHATSAPP`.

## Próximos pasos (TODO en código)

- Validar choque de slots antes de aprobar reserva
- Descontar `quantity` del Reagent al aprobar `ReagentRequest`
- Lookup de email/teléfono del estudiante al notificar resolución
- Verificación de email con código (estructura ya está, falta wiring)
- Plantillas WhatsApp aprobadas (template messages)
- Agregaciones reales en `analytics.service.ts`
