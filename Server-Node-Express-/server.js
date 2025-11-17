const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas para archivos estáticos (Excel)
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Archivos de datos
const PAGOS_FILE = path.join(__dirname, 'data', 'pagos.json');
const EMPRESAS_FILE = path.join(__dirname, 'data', 'empresas.json');
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

// Asegurar que existan los directorios
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Inicializar archivos si no existen
function inicializarArchivos() {
  if (!fs.existsSync(PAGOS_FILE)) {
    fs.writeFileSync(PAGOS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(EMPRESAS_FILE)) {
    const empresasIniciales = [
      { idEmpresa: 1, nombre: 'Empresa Ejemplo 1' },
      { idEmpresa: 2, nombre: 'Empresa Ejemplo 2' }
    ];
    fs.writeFileSync(EMPRESAS_FILE, JSON.stringify(empresasIniciales, null, 2));
  }
}

inicializarArchivos();

// Funciones auxiliares
function leerPagos() {
  try {
    const data = fs.readFileSync(PAGOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function guardarPagos(pagos) {
  fs.writeFileSync(PAGOS_FILE, JSON.stringify(pagos, null, 2));
}

function leerEmpresas() {
  try {
    const data = fs.readFileSync(EMPRESAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function guardarEmpresas(empresas) {
  fs.writeFileSync(EMPRESAS_FILE, JSON.stringify(empresas, null, 2));
}

// RUTAS

// Obtener todas las ventas
app.get('/ventas', (req, res) => {
  const pagos = leerPagos();
  res.json(pagos);
});

// Obtener ventas filtradas por empresa y fecha
app.get('/ventas/filtradas', (req, res) => {
  const { idEmpresa, fechaInicio, fechaFin } = req.query;
  let pagos = leerPagos();
  
  if (idEmpresa) {
    pagos = pagos.filter(p => p.idEmpresa == idEmpresa);
  }
  
  if (fechaInicio) {
    pagos = pagos.filter(p => p.fechaDePago >= fechaInicio);
  }
  
  if (fechaFin) {
    pagos = pagos.filter(p => p.fechaDePago <= fechaFin);
  }
  
  res.json(pagos);
});

// Registrar un nuevo pago
app.post('/api/pagos', (req, res) => {
  const pagos = leerPagos();
  const nuevoPago = {
    idPago: pagos.length > 0 ? Math.max(...pagos.map(p => p.idPago || 0)) + 1 : 1,
    ...req.body
  };
  
  pagos.push(nuevoPago);
  guardarPagos(pagos);
  
  res.status(201).json({ message: 'Pago registrado exitosamente', pago: nuevoPago });
});

// Obtener todas las empresas
app.get('/empresas', (req, res) => {
  const empresas = leerEmpresas();
  res.json(empresas);
});

// Obtener empresas disponibles para pago (todas por ahora)
app.get('/', (req, res) => {
  const empresas = leerEmpresas();
  res.json(empresas);
});

// Crear nueva empresa
app.post('/empresas', (req, res) => {
  const empresas = leerEmpresas();
  const nuevaEmpresa = {
    idEmpresa: empresas.length > 0 ? Math.max(...empresas.map(e => e.idEmpresa)) + 1 : 1,
    nombre: req.body.nombre
  };
  
  empresas.push(nuevaEmpresa);
  guardarEmpresas(empresas);
  
  res.status(201).json({ message: 'Empresa creada exitosamente', empresa: nuevaEmpresa });
});

// Actualizar empresa
app.put('/empresas/:id', (req, res) => {
  const empresas = leerEmpresas();
  const id = parseInt(req.params.id);
  const index = empresas.findIndex(e => e.idEmpresa === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Empresa no encontrada' });
  }
  
  empresas[index] = { ...empresas[index], nombre: req.body.nombre };
  guardarEmpresas(empresas);
  
  res.json({ message: 'Empresa actualizada exitosamente', empresa: empresas[index] });
});

// Eliminar empresa
app.delete('/empresas/:id', (req, res) => {
  const empresas = leerEmpresas();
  const id = parseInt(req.params.id);
  const empresasFiltradas = empresas.filter(e => e.idEmpresa !== id);
  
  if (empresas.length === empresasFiltradas.length) {
    return res.status(404).json({ message: 'Empresa no encontrada' });
  }
  
  guardarEmpresas(empresasFiltradas);
  res.json({ message: 'Empresa eliminada exitosamente' });
});

// Descargar ventas en Excel
app.get('/ventas/excel', (req, res) => {
  const { idEmpresa, fechaInicio, fechaFin } = req.query;
  let pagos = leerPagos();
  const empresas = leerEmpresas();
  
  // Filtrar si hay parámetros
  if (idEmpresa) {
    pagos = pagos.filter(p => p.idEmpresa == idEmpresa);
  }
  if (fechaInicio) {
    pagos = pagos.filter(p => p.fechaDePago >= fechaInicio);
  }
  if (fechaFin) {
    pagos = pagos.filter(p => p.fechaDePago <= fechaFin);
  }
  
  // Crear datos para Excel
  const datosExcel = pagos.map(pago => {
    const empresa = empresas.find(e => e.idEmpresa === pago.idEmpresa);
    return {
      'ID Pago': pago.idPago || '',
      'Nombre Cliente': pago.nombreCliente || '',
      'Apellido Cliente': pago.apellidoCliente || '',
      'Empresa': empresa ? empresa.nombre : '',
      'Importe': pago.importe || 0,
      'Método de Pago': pago.metodoDePago || '',
      'Fecha de Pago': pago.fechaDePago || ''
    };
  });
  
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
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


