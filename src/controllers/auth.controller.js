import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
    const { email, password, name, role, servicios, descripcion, contacto } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: passwordHash,
            name,
            role: role || 'user', // por defecto 'user'
            servicios: role === 'proveedor' ? servicios : [],
            descripcion: role === 'proveedor' ? descripcion : undefined,
            contacto: role === 'proveedor' ? contacto : undefined
        });
        const userSave = await newUser.save();
        const token = await createAccessToken({ id: userSave._id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.json({
            id: userSave._id,
            name: userSave.name,
            email: userSave.email,
            role: userSave.role,
            servicios: userSave.servicios,
            descripcion: userSave.descripcion,
            contacto: userSave.contacto,
            createdAt: userSave.createdAt,
            updatedAt: userSave.updatedAt
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = await createAccessToken({ id: userFound._id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role,
            servicios: userFound.servicios,
            descripcion: userFound.descripcion,
            contacto: userFound.contacto,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
        servicios: userFound.servicios,
        descripcion: userFound.descripcion,
        contacto: userFound.contacto,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    });
};
