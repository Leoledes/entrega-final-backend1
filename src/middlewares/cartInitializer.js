// src/middlewares/cartInitializer.js

const cartDAO = require('../dao/cart.dao');

const cartInitializer = async (req, res, next) => {
    if (!req.session.cartId) {
        try {
            const newCart = await cartDAO.createCart();
            req.session.cartId = newCart._id.toString();
            
            // Forzamos el guardado de la sesión antes de continuar
            req.session.save((err) => {
                if (err) {
                    console.error("Error al guardar la sesión del carrito:", err);
                }
                next(); // Continuar después de guardar
            });
            
            return; 
        } catch (error) {
            console.error("Error al crear el carrito en el middleware:", error.message);
            // Si falla la DB, continuamos para no bloquear la app
            return next(); 
        }
    }
    // Si ya existe req.session.cartId, simplemente continúa
    next();
};

module.exports = cartInitializer;