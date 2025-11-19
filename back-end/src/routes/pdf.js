const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const {format} = require('date-fns');

router.post('/generar-pdf', generarPDF);

async function generarPDF(req, res) {
    let browser = null;
    try {
        console.log('📄 Iniciando generación de PDF...');
        const { idEmpleado, nombreEmpleado, trimestre } = req.body;
        console.log(`👤 Empleado: ${nombreEmpleado} (ID: ${idEmpleado})`);
        if (trimestre) {
            console.log(`📅 Trimestre específico: ${trimestre}`);
        }

        if (!idEmpleado || !nombreEmpleado) {
            return res.status(400).json({ message: "ID de empleado y nombre son obligatorios" });
        }

        // Obtener datos del empleado desde la base de datos
        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });

        console.log('🔍 Consultando objetivos...');
        // Obtener objetivos asignados
        const queryObjetivos = `
            SELECT * FROM Objetivo o 
            JOIN ObjetivoEmpleado oe ON o.idObjetivo = oe.objetivo 
            WHERE oe.empleado = ? 
            ORDER BY idObjetivoEmpleado ASC;
        `;

        const objetivos = await new Promise((resolve, reject) => {
            connection.query(queryObjetivos, [idEmpleado], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        console.log(`✅ Encontrados ${objetivos.length} objetivos`);

        // Formatear fechas
        const objetivosFormateados = objetivos.map(objetivo => ({
            ...objetivo,
            fechaInicio: format(new Date(objetivo.fechaInicio), 'dd/MM/yyyy'),
            fechaFinal: format(new Date(objetivo.fechaFinal), 'dd/MM/yyyy'),
            fechaAsignacion: format(new Date(objetivo.fechaAsignacion), 'dd/MM/yyyy')
        }));

        console.log('📊 Consultando puntuaciones...');
        // Obtener puntuaciones según el trimestre especificado
        for (let objetivo of objetivosFormateados) {
            let queryPuntuacion, queryParams;
            
            if (trimestre) {
                // Consulta para trimestre específico
                queryPuntuacion = `
                    SELECT COALESCE(valor, 0) as promedio
                    FROM Puntuacion 
                    WHERE objetivo = ? AND trimestre = ?
                `;
                queryParams = [objetivo.idObjetivoEmpleado, trimestre];
            } else {
                // Consulta para promedio de todos los trimestres
                queryPuntuacion = `
                    SELECT (COALESCE(SUM(valor), 0) / 4) as promedio
                    FROM Puntuacion 
                    WHERE objetivo = ? AND trimestre > 0
                `;
                queryParams = [objetivo.idObjetivoEmpleado];
            }
            
            const puntuacion = await new Promise((resolve, reject) => {
                connection.query(queryPuntuacion, queryParams, (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0] || { promedio: 0 });
                });
            });
            
            objetivo.puntuacion = puntuacion.promedio || 0;
        }

        console.log('🎨 Generando HTML...');
        // Generar HTML con los datos
        const htmlContent = generarHTMLTemplate(nombreEmpleado, objetivosFormateados, trimestre);

        console.log('🚀 Lanzando Puppeteer...');
        // Generar PDF con Puppeteer
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
        });

        console.log('📃 Creando página...');
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 30000 });

        console.log('📄 Generando PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        browser = null;

        console.log('✅ PDF generado exitosamente');
        console.log(`📦 Tamaño del PDF: ${pdfBuffer.length} bytes`);
        
        // Enviar PDF como respuesta - IMPORTANTE: No agregar charset
        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Reporte_${nombreEmpleado}_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer, 'binary');

    } catch (error) {
        console.error('❌ Error generando PDF:', error);
        if (browser) {
            await browser.close();
        }
        res.status(500).json({ message: 'Error al generar el PDF', error: error.message, stack: error.stack });
    }
}

function generarHTMLTemplate(nombreEmpleado, objetivos, trimestre = null) {
    // Calcular peso total y desempeño
    const pesoTotal = objetivos.reduce((sum, obj) => sum + obj.peso, 0);
    // Cálculo del desempeño total: suma total de todas las puntuaciones
    const sumaPuntuaciones = objetivos.reduce((sum, obj) => sum + Number(obj.puntuacion || 0), 0);
    const desempenoTotal = trimestre ? sumaPuntuaciones / objetivos.length : sumaPuntuaciones;
    
    // Generar colores aleatorios para cada objetivo
    const colores = objetivos.map(() => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Objetivos - ${nombreEmpleado}</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: #fafbfc;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #fbb003 0%, #ff8000 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        .leyenda-section {
            background: white;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .leyenda-section h2 {
            color: #2c3e50;
            font-size: 1.3rem;
            margin-bottom: 20px;
            border-bottom: 2px solid #fbb003;
            padding-bottom: 10px;
        }

        .barra-container {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .barra-label {
            min-width: 120px;
            font-weight: 600;
            color: #2c3e50;
        }

        .barra-progreso {
            flex: 1;
            height: 30px;
            background: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }

        .barra-fill {
            height: 100%;
            background: linear-gradient(90deg, #fbb003, #ff8000);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transition: width 0.3s ease;
        }

        /* Barras de peso y desempeño estilo Feed */
        .barra-visual {
            display: flex;
            height: 30px;
            width: 100%;
            border: 1px solid #000;
            border-radius: 0 10px 10px 0;
            font-size: 12px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .barra-segmento {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 5px solid;
            position: relative;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .barra-vacia {
            flex-grow: 1;
            background-color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0 10px 10px 0;
            margin-left: -5px;  
            color: #666;
            font-size: 11px;
        }

        .desempeno-total {
            color: #2c3e50;
            font-size: 1.2rem;
            font-weight: 600;
            margin: 20px 0;
            padding: 15px;
            background: #fff8e6;
            border-radius: 12px;
            border-left: 4px solid #fbb003;
        }

        /* Leyendas */
        .contenedor-leyendas {
            display: flex;
            gap: 24px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .contenedor-leyenda {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            padding: 24px;
            flex: 1;
            min-width: 320px;
            max-width: 450px;
            box-shadow: 
                0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
            position: relative;
            overflow: hidden;
        }

        .contenedor-leyenda::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #fbb003, #ff8000);
            border-radius: 16px 16px 0 0;
        }

        .contenedor-leyenda h3 {
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 20px 0;
            text-align: center;
            position: relative;
            padding-bottom: 12px;
        }

        .contenedor-leyenda h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 2px;
            background: linear-gradient(90deg, #fbb003, #ff8000);
            border-radius: 1px;
        }

        .leyenda-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0 0 12px 0;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 12px;
            border: 1px solid transparent;
            font-size: 0.95rem;
            line-height: 1.4;
        }

        .leyenda-item:last-child {
            margin-bottom: 0;
        }

        .leyenda-bullet {
            font-size: 18px;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .leyenda-item span:not(.leyenda-bullet) {
            flex: 1;
            color: #4a5568;
            font-weight: 500;
        }

        .leyenda-item b {
            color: #fbb003;
            font-weight: 600;
            font-size: 0.9rem;
            min-width: 60px;
            text-align: right;
        }

        /* Fallback para PDF sin gradientes de texto */
        @media print {
            .leyenda-item b {
                color: #fbb003 !important;
                background: none !important;
                -webkit-text-fill-color: #fbb003 !important;
            }
        }

        .objetivos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }

        .objetivo-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
            page-break-inside: avoid;
        }

        .objetivo-titulo {
            color: #2c3e50;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .objetivo-fechas {
            background: #f5f5f5;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .fecha-item {
            font-size: 0.9rem;
            color: #2c3e50;
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
        }

        .fecha-item b {
            color: #fbb003;
            font-weight: 600;
        }

        .objetivo-descripcion {
            color: #2c3e50;
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 15px 0;
        }

        .objetivo-progreso {
            display: flex;
            align-items: center;
            gap: 15px;
            background: #fff8e6;
            padding: 15px;
            border-radius: 12px;
            border-left: 4px solid #fbb003;
        }

        .progreso-label {
            font-weight: 500;
            color: #2c3e50;
            min-width: 50px;
        }

        .progreso-bar {
            flex: 1;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }

        .progreso-fill {
            height: 100%;
            background: linear-gradient(90deg, #fbb003, #ff8000);
            border-radius: 5px;
        }

        .progreso-value {
            font-weight: 600;
            color: #fbb003;
            min-width: 50px;
            text-align: right;
        }

        hr {
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
            margin: 15px 0;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte de Objetivos${trimestre ? ` - Trimestre ${trimestre}` : ' - Completo'}</h1>
            <p>${nombreEmpleado}</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Generado el ${format(new Date(), 'dd/MM/yyyy')}</p>
        </div>

        <div class="leyenda-section">
            <h2>Desempeño Total: ${desempenoTotal.toFixed(2)}%</h2>
            <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                ${trimestre 
                    ? `Calculado como: Promedio de puntuaciones del trimestre ${trimestre} (${sumaPuntuaciones.toFixed(2)}% / ${objetivos.length} objetivos)`
                    : `Calculado como: Suma total de todos los promedios de puntuaciones (${sumaPuntuaciones.toFixed(2)}%)`
                }
            </p>
        </div>

        <div class="contenedor-leyendas">
            <div class="contenedor-leyenda">
                <h3>Barra de peso de los objetivos</h3>
                ${objetivos.map((obj, index) => {
                    const color = colores[index];
                    const porcentaje = obj.peso;
                    return `
                        <div class="leyenda-item">
                            <span class="leyenda-bullet" style="color: ${color};">⦿</span>
                            <span>${obj.titulo}:</span>
                            <b>${porcentaje}%</b>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="contenedor-leyenda">
                <h3>Barra de desempeño</h3>
                ${objetivos.map((obj, index) => {
                    const color = colores[index];
                    const promedioPuntuacion = Number(obj.puntuacion || 0); // Promedio de los 4 trimestres
                    return `
                        <div class="leyenda-item">
                            <span class="leyenda-bullet" style="color: ${color};">⦿</span>
                            <span>${obj.titulo}:</span>
                            <b>${promedioPuntuacion.toFixed(2)}%</b>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <h3 style="margin-left: 17px; margin-bottom: 15px; color: #2c3e50;">Objetivos asignados:</h3>

        <div class="objetivos-grid">
            ${objetivos.map(objetivo => `
                <div class="objetivo-card">
                    <h2 class="objetivo-titulo">${objetivo.titulo}</h2>
                    
                    <div class="objetivo-fechas">
                        <div class="fecha-item">
                            <span>Fecha de inicio:</span>
                            <b>${objetivo.fechaInicio}</b>
                        </div>
                        <div class="fecha-item">
                            <span>Fecha Final:</span>
                            <b>${objetivo.fechaFinal}</b>
                        </div>
                        <div class="fecha-item">
                            <span>Fue asignado el:</span>
                            <b>${objetivo.fechaAsignacion}</b>
                        </div>
                    </div>

                    <hr>

                    <p class="objetivo-descripcion">
                        <strong>Descripción:</strong> ${objetivo.descripcion}
                    </p>

                    <div class="objetivo-progreso">
                        <span class="progreso-label">Peso:</span>
                        <div class="progreso-bar">
                            <div class="progreso-fill" style="width: ${objetivo.peso}%"></div>
                        </div>
                        <span class="progreso-value">${objetivo.peso}%</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Este documento fue generado automáticamente por el sistema de gestión de objetivos</p>
        </div>
    </div>
</body>
</html>
    `;
}

module.exports = router;
