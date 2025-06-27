export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Obtén las claves del schema para mapear errores vacíos
    const schemaKeys = Object.keys(schema.shape || {});
    return res.status(400).json({
      errors: error.errors.map((err, idx) => ({
        path: err.path && err.path.length > 0 ? err.path[0] : (schemaKeys[idx] || ''),
        message: err.message
      }))
    });
  }
};