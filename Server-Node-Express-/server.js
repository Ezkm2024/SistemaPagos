const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const dbConfig = require('./config');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas para archivos estáticos (Excel)
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Pool de conexiones SQL Server
let pool = null;

// Conectar a SQL Server
async function conectarDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a SQL Server correctamente');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error);
    console.error('⚠️  Verifica la configuración en config.js');
    process.exit(1);
  }
}

// Inicializar conexión
conectarDB();

// RUTAS

// Obtener todas las ventas
app.get('/ventas', async (req, res) => {
  try {
    const result = await pool.request()
      .execute('sp_ObtenerVentasFiltradas');
    
    const ventas = result.recordset.map(row => ({
      idPago: row.idPago,
      idEmpresa: row.idEmpresa,
      nombreCliente: row.nombreCliente,
      apellidoCliente: row.apellidoCliente,
      importe: parseFloat(row.importe),
      metodoDePago: row.metodoDePago,
      fechaDePago: row.fechaDePago.toISOString().split('T')[0]
    }));
    
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
});

// Obtener ventas filtradas por empresa y fecha
app.get('/ventas/filtradas', async (req, res) => {
  try {
    const { idEmpresa, fechaInicio, fechaFin } = req.query;
    
    const request = pool.request();
    
    if (idEmpresa) {
      request.input('idEmpresa', sql.Int, parseInt(idEmpresa));
    } else {
      request.input('idEmpresa', sql.Int, null);
    }
    
    if (fechaInicio) {
      request.input('fechaInicio', sql.Date, fechaInicio);
    } else {
      request.input('fechaInicio', sql.Date, null);
    }
    
    if (fechaFin) {
      request.input('fechaFin', sql.Date, fechaFin);
    } else {
      request.input('fechaFin', sql.Date, null);
    }
    
    const result = await request.execute('sp_ObtenerVentasFiltradas');
    
    const ventas = result.recordset.map(row => ({
      idPago: row.idPago,
      idEmpresa: row.idEmpresa,
      nombreCliente: row.nombreCliente,
      apellidoCliente: row.apellidoCliente,
      importe: parseFloat(row.importe),
      metodoDePago: row.metodoDePago,
      fechaDePago: row.fechaDePago.toISOString().split('T')[0]
    }));
    
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas filtradas:', error);
    res.status(500).json({ message: 'Error al obtener ventas filtradas', error: error.message });
  }
});

// Función para generar Excel de un pago
function generarExcelPago(pago, nombreEmpresa) {
  try {
    // Crear datos para Excel
    const datosExcel = [{
      'ID Pago': pago.idPago,
      'Nombre Cliente': pago.nombreCliente,
      'Apellido Cliente': pago.apellidoCliente,
      'Empresa': nombreEmpresa,
      'Importe': parseFloat(pago.importe),
      'Método de Pago': pago.metodoDePago,
      'Fecha de Pago': pago.fechaDePago
    }];
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 10 }, // ID Pago
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido
      { wch: 25 }, // Empresa
      { wch: 15 }, // Importe
      { wch: 18 }, // Método
      { wch: 15 }  // Fecha
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Pago');
    
    // Generar nombre de archivo con ID del pago
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `pago_${pago.idPago}_${timestamp}.xlsx`;
    const filepath = path.join(DOWNLOADS_DIR, filename);
    
    // Guardar archivo
    XLSX.writeFile(wb, filepath);
    
    return { filename, filepath };
  } catch (error) {
    console.error('Error al generar Excel del pago:', error);
    return null;
  }
}

// Registrar un nuevo pago
app.post('/api/pagos', async (req, res) => {
  try {
    const { idEmpresa, nombreCliente, apellidoCliente, importe, metodoDePago, fechaDePago } = req.body;
    
    const request = pool.request();
    request.input('idEmpresa', sql.Int, idEmpresa);
    request.input('nombreCliente', sql.NVarChar(50), nombreCliente);
    request.input('apellidoCliente', sql.NVarChar(50), apellidoCliente);
    request.input('importe', sql.Decimal(10, 2), importe);
    request.input('metodoDePago', sql.NVarChar(50), metodoDePago);
    request.input('fechaDePago', sql.Date, fechaDePago);
    request.output('idPago', sql.Int);
    
    const result = await request.execute('sp_InsertarPago');
    
    const nuevoPago = {
      idPago: result.output.idPago,
      idEmpresa,
      nombreCliente,
      apellidoCliente,
      importe,
      metodoDePago,
      fechaDePago
    };
    
    // Obtener nombre de la empresa para el Excel
    const empresaResult = await pool.request()
      .input('idEmpresa', sql.Int, idEmpresa)
      .query('SELECT nombre FROM Empresas WHERE idEmpresa = @idEmpresa');
    
    const nombreEmpresa = empresaResult.recordset[0]?.nombre || 'N/A';
    
    // Generar Excel del pago
    const excelInfo = generarExcelPago(nuevoPago, nombreEmpresa);
    
    if (excelInfo) {
      console.log(`✅ Excel generado: ${excelInfo.filename}`);
      res.status(201).json({ 
        message: 'Pago registrado exitosamente y Excel generado', 
        pago: nuevoPago,
        excel: {
          filename: excelInfo.filename,
          downloadUrl: `/downloads/${excelInfo.filename}`
        }
      });
    } else {
      res.status(201).json({ 
        message: 'Pago registrado exitosamente (error al generar Excel)', 
        pago: nuevoPago
      });
    }
  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ message: 'Error al registrar pago', error: error.message });
  }
});

// Obtener todas las empresas
app.get('/empresas', async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT idEmpresa, nombre FROM Empresas WHERE activo = 1 ORDER BY nombre');
    
    const empresas = result.recordset.map(row => ({
      idEmpresa: row.idEmpresa,
      nombre: row.nombre
    }));
    
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ message: 'Error al obtener empresas', error: error.message });
  }
});

// Obtener empresas disponibles para pago (todas activas)
app.get('/', async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT idEmpresa, nombre FROM Empresas WHERE activo = 1 ORDER BY nombre');
    
    const empresas = result.recordset.map(row => ({
      idEmpresa: row.idEmpresa,
      nombre: row.nombre
    }));
    
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ message: 'Error al obtener empresas', error: error.message });
  }
});

// Crear nueva empresa
app.post('/empresas', async (req, res) => {
  try {
    const { nombre } = req.body;
    
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query(`
        INSERT INTO Empresas (nombre) 
        OUTPUT INSERTED.idEmpresa, INSERTED.nombre
        VALUES (@nombre)
      `);
    
    const nuevaEmpresa = {
      idEmpresa: result.recordset[0].idEmpresa,
      nombre: result.recordset[0].nombre
    };
    
    res.status(201).json({ message: 'Empresa creada exitosamente', empresa: nuevaEmpresa });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ message: 'Error al crear empresa', error: error.message });
  }
});

// Actualizar empresa
app.put('/empresas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    
    const result = await pool.request()
      .input('idEmpresa', sql.Int, id)
      .input('nombre', sql.NVarChar(100), nombre)
      .query(`
        UPDATE Empresas 
        SET nombre = @nombre 
        WHERE idEmpresa = @idEmpresa;
        
        SELECT idEmpresa, nombre FROM Empresas WHERE idEmpresa = @idEmpresa;
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    
    const empresaActualizada = {
      idEmpresa: result.recordset[0].idEmpresa,
      nombre: result.recordset[0].nombre
    };
    
    res.json({ message: 'Empresa actualizada exitosamente', empresa: empresaActualizada });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ message: 'Error al actualizar empresa', error: error.message });
  }
});

// Eliminar empresa (marcar como inactiva)
app.delete('/empresas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await pool.request()
      .input('idEmpresa', sql.Int, id)
      .query(`
        UPDATE Empresas 
        SET activo = 0 
        WHERE idEmpresa = @idEmpresa;
        
        SELECT @@ROWCOUNT as affectedRows;
      `);
    
    if (result.recordset[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    
    res.json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ message: 'Error al eliminar empresa', error: error.message });
  }
});

// Descargar ventas en Excel
app.get('/ventas/excel', async (req, res) => {
  try {
    const { idEmpresa, fechaInicio, fechaFin } = req.query;
    
    const request = pool.request();
    
    if (idEmpresa) {
      request.input('idEmpresa', sql.Int, parseInt(idEmpresa));
    } else {
      request.input('idEmpresa', sql.Int, null);
    }
    
    if (fechaInicio) {
      request.input('fechaInicio', sql.Date, fechaInicio);
    } else {
      request.input('fechaInicio', sql.Date, null);
    }
    
    if (fechaFin) {
      request.input('fechaFin', sql.Date, fechaFin);
    } else {
      request.input('fechaFin', sql.Date, null);
    }
    
    const result = await request.execute('sp_ObtenerVentasFiltradas');
    
    // Crear datos para Excel
    const datosExcel = result.recordset.map(row => ({
      'ID Pago': row.idPago || '',
      'Nombre Cliente': row.nombreCliente || '',
      'Apellido Cliente': row.apellidoCliente || '',
      'Empresa': row.nombreEmpresa || '',
      'Importe': parseFloat(row.importe) || 0,
      'Método de Pago': row.metodoDePago || '',
      'Fecha de Pago': row.fechaDePago.toISOString().split('T')[0] || ''
    }));
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 10 }, // ID Pago
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido
      { wch: 25 }, // Empresa
      { wch: 15 }, // Importe
      { wch: 18 }, // Método
      { wch: 15 }  // Fecha
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    
    // Generar nombre de archivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `ventas_${timestamp}.xlsx`;
    const filepath = path.join(DOWNLOADS_DIR, filename);
    
    // Guardar archivo
    XLSX.writeFile(wb, filepath);
    
    // Enviar archivo
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
        res.status(500).json({ message: 'Error al generar archivo Excel' });
      } else {
        // Opcional: eliminar archivo después de enviarlo
        setTimeout(() => {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ message: 'Error al generar archivo Excel', error: error.message });
  }
});

// Manejo de errores de conexión
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando conexión a SQL Server...');
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Asegúrate de haber ejecutado el script database.sql en SQL Server`);
});
