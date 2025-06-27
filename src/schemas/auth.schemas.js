import { z } from "zod";

const ROLE_VALUES = ["admin", "user", "proveedor"];
const SERVICIOS_VALUES = [
  "dj", "comida", "musica", "luz", "sonido", "decoracion", "fotografia", "video", "otro"
];

export const registerSchema = z.object({
  username: z.string({ required_error: "El nombre de usuario es obligatorio" }).min(1, { message: "El nombre de usuario es obligatorio" }),
  email: z.string({ required_error: "El email es obligatorio" }).email({ message: "El email no es válido" }),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.enum(ROLE_VALUES, { required_error: "El rol es obligatorio", invalid_type_error: "Rol no válido" }).default("user"),
  servicios: z.array(z.enum(SERVICIOS_VALUES, { invalid_type_error: "Servicio no válido" })).optional(),
  descripcion: z.string().optional(),
  contacto: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string({ required_error: "El email es obligatorio" }).email({ message: "El email no es válido" }),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});