const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { logger, apiRateLimit } = require('../middleware/security');
const router = express.Router();

// Initialize Supabase client server-side
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Apply rate limiting to all API routes
router.use(apiRateLimit);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Proxy Supabase queries
router.post('/supabase/query', async (req, res) => {
  try {
    const { table, operation, data, filters } = req.body;
    
    // Validate request
    if (!table || !operation) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let result;
    let query = supabase.from(table);

    switch (operation) {
      case 'select':
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        result = await query.select();
        break;
        
      case 'insert':
        result = await query.insert(data);
        break;
        
      case 'update':
        result = await query.update(data).eq('id', data.id);
        break;
        
      case 'delete':
        result = await query.delete().eq('id', data.id);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    if (result.error) {
      logger.error('Supabase operation failed', {
        table,
        operation,
        error: result.error,
        userId: req.user?.id
      });
      return res.status(500).json({ error: 'Database operation failed' });
    }

    logger.info('Supabase operation successful', {
      table,
      operation,
      recordCount: result.data?.length || 0,
      userId: req.user?.id
    });

    res.json(result);
  } catch (error) {
    logger.error('API proxy error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Parse HCP data endpoint (proxy to edge function)
router.post('/parse-hcp-data', async (req, res) => {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/parse-hcp-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      logger.error('HCP parsing failed', { error: data.error, userId: req.user?.id });
      return res.status(response.status).json(data);
    }

    logger.info('HCP parsing successful', {
      providersFound: data.providers?.length || 0,
      sourceType: req.body.type,
      userId: req.user?.id
    });

    res.json(data);
  } catch (error) {
    logger.error('HCP parsing proxy error', { error: error.message });
    res.status(500).json({ error: 'Parsing service unavailable' });
  }
});

module.exports = router;