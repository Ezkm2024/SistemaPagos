-- =============================================
-- Script de Base de Datos - Sistema de Pagos
-- Prof. Paula Robles - Dolores, Buenos Aires
-- =============================================

-- Crear la base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SistemaPagos')
BEGIN
    CREATE DATABASE SistemaPagos;
END
GO

USE SistemaPagos;
GO

-- =============================================
-- Tabla: Empresas
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Empresas]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Empresas] (
        [idEmpresa] INT IDENTITY(1,1) PRIMARY KEY,
        [nombre] NVARCHAR(100) NOT NULL,
        [fechaCreacion] DATETIME DEFAULT GETDATE(),
        [activo] BIT DEFAULT 1
    );
    
    -- Insertar empresas de ejemplo
    INSERT INTO [dbo].[Empresas] (nombre) VALUES 
        ('Empresa Ejemplo 1'),
        ('Empresa Ejemplo 2');
END
GO

-- =============================================
-- Tabla: Pagos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pagos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Pagos] (
        [idPago] INT IDENTITY(1,1) PRIMARY KEY,
        [idEmpresa] INT NOT NULL,
        [nombreCliente] NVARCHAR(50) NOT NULL,
        [apellidoCliente] NVARCHAR(50) NOT NULL,
        [importe] DECIMAL(10,2) NOT NULL,
        [metodoDePago] NVARCHAR(50) NOT NULL,
        [fechaDePago] DATE NOT NULL,
        [fechaRegistro] DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (idEmpresa) REFERENCES [dbo].[Empresas](idEmpresa)
    );
    
    -- Crear índice para mejorar búsquedas
    CREATE INDEX IX_Pagos_FechaDePago ON [dbo].[Pagos](fechaDePago);
    CREATE INDEX IX_Pagos_idEmpresa ON [dbo].[Pagos](idEmpresa);
END
GO

-- =============================================
-- Procedimiento Almacenado: Obtener Ventas Filtradas
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ObtenerVentasFiltradas]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_ObtenerVentasFiltradas];
GO

CREATE PROCEDURE [dbo].[sp_ObtenerVentasFiltradas]
    @idEmpresa INT = NULL,
    @fechaInicio DATE = NULL,
    @fechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.idPago,
        p.idEmpresa,
        p.nombreCliente,
        p.apellidoCliente,
        p.importe,
        p.metodoDePago,
        p.fechaDePago,
        p.fechaRegistro,
        e.nombre AS nombreEmpresa
    FROM [dbo].[Pagos] p
    INNER JOIN [dbo].[Empresas] e ON p.idEmpresa = e.idEmpresa
    WHERE 
        (@idEmpresa IS NULL OR p.idEmpresa = @idEmpresa)
        AND (@fechaInicio IS NULL OR p.fechaDePago >= @fechaInicio)
        AND (@fechaFin IS NULL OR p.fechaDePago <= @fechaFin)
        AND e.activo = 1
    ORDER BY p.fechaDePago DESC, p.fechaRegistro DESC;
END
GO

-- =============================================
-- Procedimiento Almacenado: Insertar Pago
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_InsertarPago]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_InsertarPago];
GO

CREATE PROCEDURE [dbo].[sp_InsertarPago]
    @idEmpresa INT,
    @nombreCliente NVARCHAR(50),
    @apellidoCliente NVARCHAR(50),
    @importe DECIMAL(10,2),
    @metodoDePago NVARCHAR(50),
    @fechaDePago DATE,
    @idPago INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[Pagos] 
        (idEmpresa, nombreCliente, apellidoCliente, importe, metodoDePago, fechaDePago)
    VALUES 
        (@idEmpresa, @nombreCliente, @apellidoCliente, @importe, @metodoDePago, @fechaDePago);
    
    SET @idPago = SCOPE_IDENTITY();
END
GO

-- =============================================
-- Procedimiento Almacenado: Obtener Estadísticas
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ObtenerEstadisticas]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_ObtenerEstadisticas];
GO

CREATE PROCEDURE [dbo].[sp_ObtenerEstadisticas]
    @idEmpresa INT = NULL,
    @fechaInicio DATE = NULL,
    @fechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) AS totalVentas,
        ISNULL(SUM(importe), 0) AS totalImporte,
        ISNULL(AVG(importe), 0) AS promedioVenta
    FROM [dbo].[Pagos] p
    INNER JOIN [dbo].[Empresas] e ON p.idEmpresa = e.idEmpresa
    WHERE 
        (@idEmpresa IS NULL OR p.idEmpresa = @idEmpresa)
        AND (@fechaInicio IS NULL OR p.fechaDePago >= @fechaInicio)
        AND (@fechaFin IS NULL OR p.fechaDePago <= @fechaFin)
        AND e.activo = 1;
END
GO

-- =============================================
-- Verificar que todo se creó correctamente
-- =============================================
SELECT 'Base de datos creada exitosamente' AS Mensaje;
SELECT COUNT(*) AS TotalEmpresas FROM [dbo].[Empresas];
SELECT COUNT(*) AS TotalPagos FROM [dbo].[Pagos];
GO

