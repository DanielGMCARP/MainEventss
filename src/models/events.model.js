import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    endDate: { type: Date }, // fecha de fin opcional
    duration: { type: Number }, // en minutos
    location: { type: String, required: true },
    image: { type: String, required: true }, // URL o nombre de archivo
    organizer: { type: String, required: true },
    proveedores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor'
    }],
    type: {
        type: String,
        enum: ['publico', 'privado', 'corporativo', 'musical', 'deportivo', 'educativo', 'cultural'],
        default: 'publico',
        required: true
    },
    estado: {
        type: String,
        enum: ['activo', 'cancelado', 'completado', 'pendiente'],
        default: 'activo',
        required: true
    },
    capacidad: { type: Number, required: true },
    concurrentes: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // creador
    price: { type: Number, required: true, min: 0 }, // 0 = gratis
    attendees: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    tags: [{ type: String }],
    category: { type: String },
    visibility: { type: String, enum: ['publico', 'privado'], default: 'publico' },
    urlStreaming: { type: String },
    comments: [commentSchema],
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visitas: { type: Number, default: 0 },
    historial: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: String,
        date: { type: Date, default: Date.now }
    }], // <-- COMA AQUÍ
    solicitudesProveedores: [{
        servicio: { type: String, required: true }, // Ej: 'dj', 'comida'
        descripcion: String,
        proveedorAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
        estado: { type: String, enum: ['pendiente', 'aceptado', 'rechazado'], default: 'pendiente' }
    }]
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);