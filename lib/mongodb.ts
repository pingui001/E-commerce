// lib/mongodb.ts
import mongoose from "mongoose";

// Declaración global perfecta para Next.js 16 + TypeScript strict
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Usamos const + valor inicial claro → elimina el error de ESLint "prefer-const"
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = global.mongoose ?? { conn: null, promise: null };

// Guardamos en global para futuras ejecuciones (serverless)
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // Si ya está conectado → devolvemos directamente
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay una promesa en curso → la creamos
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((m) => {
      console.log("MongoDB conectado correctamente");
      return m;
    });
  }

  // Esperamos la conexión
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // En caso de error, limpiamos para reintentar
    cached.promise = null;
    throw error;
  }
}