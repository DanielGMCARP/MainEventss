import { Router } from 'express';
import { getAllEvents } from '../controllers/event.controllers.js';

import { authRequired } from '../middlewares/validateToken.js';
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    getAttendedEvents,
    favoriteEvent,
    commentEvent
} from '../controllers/event.controllers.js';

const router = Router();

router.get('/events', authRequired, getEvents); // Eventos creados por el usuario
router.get('/events/attended', authRequired, getAttendedEvents); // Eventos a los que el usuario está anotado
router.get('/events/:id', authRequired, getEvent); // Obtener un evento por id
router.post('/events', authRequired, createEvent); // Crear evento
router.put('/events/:id', authRequired, updateEvent); // Actualizar evento
router.delete('/events/:id', authRequired, deleteEvent); // Eliminar evento
router.post('/events/attend/:id', authRequired, attendEvent); // Anotarse/comprar entradas
router.post('/events/favorite', authRequired, favoriteEvent); // Marcar como favorito
router.post('/events/comment', authRequired, commentEvent); // Comentar evento
router.get('/events/all', authRequired, getAllEvents); // Ver todos los eventos de la app

export default router;