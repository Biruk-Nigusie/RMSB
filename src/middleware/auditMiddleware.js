import { createAuditLog } from '../controllers/auditController.js';

export const auditMiddleware = (action, targetTable) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const actorType = req.user.type === 'admin' ? 'ADMIN' : 'RESIDENT';
        const ipAddress = req.ip || req.connection.remoteAddress;
        
        createAuditLog(req.user.id, actorType, action, targetTable, ipAddress);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};