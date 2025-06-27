import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: { // <-- mejor que "type"
        type: String,
        enum: ['admin', 'user', 'proveedor'],
        required: true,
        default: 'user'
    },
    servicios: [{ // Solo para proveedores
        type: String,
        enum: ['dj', 'comida', 'musica', 'luz', 'sonido', 'decoracion', 'fotografia', 'video', 'otro']
    }],
    descripcion: { type: String }, // Solo para proveedores
    contacto: { type: String },    // Solo para proveedores
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('User', userSchema)
