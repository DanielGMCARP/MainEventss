import Event from '../models/events.model.js';

// Eventos creados por el usuario autenticado
export const getEvents = async (req, res) => {
    const events = await Event.find({ user: req.user.id }).populate('user', 'name email');
    res.json(events);
};

// Eventos a los que el usuario está anotado
export const getAttendedEvents = async (req, res) => {
    const events = await Event.find({ "attendees.user": req.user.id }).populate('user', 'name email');
    res.json(events);
};

export const createEvent = async (req, res) => {
    try {
        const { name, description, date, endDate, duration, location, image, estado, capacidad, type, organizer, price, tags, category, visibility, urlStreaming } = req.body;
        const newEvent = new Event({
            name,
            description,
            date,
            endDate,
            duration,
            location,
            image,
            estado,
            capacidad,
            type,
            organizer,
            price,
            tags,
            category,
            visibility,
            urlStreaming,
            user: req.user.id
        });
        await newEvent.save();
        res.status(201).json({ message: 'Evento creado correctamente', event: newEvent });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ message: 'Error al crear el evento' });
    }
};

export const updateEvent = async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    // Historial de cambios
    event.historial.push({ user: req.user.id, action: 'editado' });
    await event.save();
    res.json(event);
};

export const deleteEvent = async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    return res.status(200).json({ message: 'Evento eliminado correctamente' });
};

export const getEvent = async (req, res) => {
    const event = await Event.findById(req.params.id).populate('user', 'name email');
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    // Contador de visitas
    event.visitas += 1;
    await event.save();
    res.json(event);
};

// Anotarse/comprar entradas
export const attendEvent = async (req, res) => {
    const { eventId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    // Capacidad máxima
    const totalEntradas = event.attendees.reduce((sum, a) => sum + a.quantity, 0);
    if (totalEntradas + quantity > event.capacidad) {
        return res.status(400).json({ message: 'No hay suficientes entradas disponibles' });
    }

    // Verifica si ya está anotado
    const attendee = event.attendees.find(a => a.user.toString() === userId);
    if (attendee) {
        attendee.quantity += quantity;
    } else {
        event.attendees.push({ user: userId, quantity });
    }

    // Actualiza el total de concurrentes
    event.concurrentes = event.attendees.reduce((sum, a) => sum + a.quantity, 0);

    await event.save();
    res.json({ message: 'Te anotaste al evento correctamente', concurrentes: event.concurrentes });
};

// Marcar como favorito
export const favoriteEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    if (!event.favoritos.includes(userId)) {
        event.favoritos.push(userId);
        await event.save();
    }
    res.json({ message: 'Evento marcado como favorito' });
};

// Agregar comentario
export const commentEvent = async (req, res) => {
    const { eventId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    event.comments.push({ user: userId, text });
    await event.save();
    res.json({ message: 'Comentario agregado' });
};

export const getAllEvents = async (req, res) => {
    const events = await Event.find().populate('user', 'name email');
    res.json(events);
};