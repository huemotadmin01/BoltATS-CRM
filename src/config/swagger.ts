import swaggerJsdoc from 'swagger-jsdoc';

export const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'ATS + CRM API', version: '1.0.0' }
  },
  apis: [] // add files later if you want real docs
});
