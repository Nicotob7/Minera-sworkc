/**
 * Iconografía central del sitio — set FORMAL (Tabler Icons).
 * Se re-exporta con los nombres usados en el código para cambiar de librería
 * solo cambiando la ruta de import (de "lucide-react" a "../ui/icons").
 * Para iconos nuevos, importar desde aquí (agregar el alias si falta).
 */
import {
  IconArrowRight,
  IconArrowUpRight,
  IconMenu2,
  IconX,
  IconMail,
  IconPhone,
  IconMapPin,
  IconUser,
  IconBuilding,
  IconMessage,
  IconLoader2,
  IconCircleCheck,
  IconAlertTriangle,
  IconGauge,
  IconRadio,
  IconClock,
  IconBrandLinkedin,
  IconAdjustmentsHorizontal,
  IconShieldExclamation,
  IconPlus,
  IconTool,
} from "@tabler/icons-react";

/** Tipo de componente de icono (reemplaza a LucideIcon). */
export type LucideIcon = typeof IconArrowRight;
export type IconType = typeof IconArrowRight;

export {
  IconArrowRight as ArrowRight,
  IconArrowUpRight as ArrowUpRight,
  IconMenu2 as Menu,
  IconX as X,
  IconMail as Mail,
  IconPhone as Phone,
  IconMapPin as MapPin,
  IconUser as User,
  IconBuilding as Building2,
  IconMessage as MessageSquare,
  IconLoader2 as Loader2,
  IconCircleCheck as CheckCircle2,
  IconAlertTriangle as AlertTriangle,
  IconGauge as Gauge,
  IconRadio as Radio,
  IconClock as Clock,
  IconBrandLinkedin as Linkedin,
  IconAdjustmentsHorizontal as SlidersHorizontal,
  IconShieldExclamation as ShieldAlert,
  IconPlus as Plus,
  IconTool as Tool,
};
