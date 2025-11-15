document.addEventListener('DOMContentLoaded', function () {
    const seedData = () => {

        const sampleWorkflows = {
            consultas: [
                { hora: 8, cantidad: 4 },
                { hora: 9, cantidad: 6 },
                { hora: 10, cantidad: 5 },
                { hora: 11, cantidad: 7 },
                { hora: 12, cantidad: 3 },
                { hora: 14, cantidad: 5 },
                { hora: 15, cantidad: 8 },
                { hora: 16, cantidad: 4 }
            ],

            tareas: [
                { tipo: "Visitas", cantidad: 6 },
                { tipo: "Revisión de historial", cantidad: 4 },
                { tipo: "Interpretación de exámenes", cantidad: 3 },
                { tipo: "Reportes", cantidad: 5 }
            ],

            especialidades: [
                { especialidad: "Cardiología", pacientes: 12 },
                { especialidad: "Pediatría", pacientes: 9 },
                { especialidad: "Neurología", pacientes: 5 },
                { especialidad: "Medicina General", pacientes: 15 }
            ],

            cargaSemanal: [
                { dia: "Lunes", carga: 70 },
                { dia: "Martes", carga: 80 },
                { dia: "Miércoles", carga: 60 },
                { dia: "Jueves", carga: 85 },
                { dia: "Viernes", carga: 75 }
            ]
        };

        if (!localStorage.getItem("workflowData")) {
            localStorage.setItem("workflowData", JSON.stringify(sampleWorkflows));
        }
    };

    seedData();

    const data = JSON.parse(localStorage.getItem("workflowData"));


    const consultasTotal = data.consultas.reduce((a, b) => a + b.cantidad, 0);
    const tareasTotal = data.tareas.reduce((a, b) => a + b.cantidad, 0);
    const pacientesTotal = data.especialidades.reduce((a, b) => a + b.pacientes, 0);
    const cargaPromedio = Math.round(
        data.cargaSemanal.reduce((a, b) => a + b.carga, 0) / data.cargaSemanal.length
    );

    document.getElementById("consultasDia").textContent = consultasTotal;
    document.getElementById("tareasPendientes").textContent = tareasTotal;
    document.getElementById("pacientesAtendidos").textContent = pacientesTotal;
    document.getElementById("nivelCarga").textContent = cargaPromedio + "%";


    const ctx1 = document.getElementById('chartConsultasPorHora').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: data.consultas.map(x => x.hora + ":00"),
            datasets: [{
                label: 'Consultas por Hora',
                data: data.consultas.map(x => x.cantidad),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2
            }]
        },
        options: {
            plugins: { title: { display: true, text: "Consultas por Hora" } }
        }
    });

    const ctx2 = document.getElementById('chartTareasTipo').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: data.tareas.map(x => x.tipo),
            datasets: [{
                label: 'Cantidad',
                data: data.tareas.map(x => x.cantidad),
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }]
        },
        options: {
            plugins: { title: { display: true, text: "Tareas por Tipo" } },
            scales: { y: { beginAtZero: true } }
        }
    });

    const ctx3 = document.getElementById('chartPacientesPorEspecialidad').getContext('2d');
    new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: data.especialidades.map(x => x.especialidad),
            datasets: [{
                data: data.especialidades.map(x => x.pacientes),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ]
            }]
        },
        options: {
            plugins: { title: { display: true, text: "Pacientes por Especialidad" } }
        }
    });

    const ctx4 = document.getElementById('chartCargaSemanal').getContext('2d');
    new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: data.cargaSemanal.map(x => x.dia),
            datasets: [{
                label: 'Nivel de Carga (%)',
                data: data.cargaSemanal.map(x => x.carga),
                backgroundColor: 'rgba(153, 102, 255, 0.7)'
            }]
        },
        options: {
            plugins: { title: { display: true, text: "Carga Semanal del Profesional" } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });


    const exportBtn = document.getElementById("exportDashboardMedBtn");
    const dashboardContent = document.querySelector("main.container");

    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const { jsPDF } = window.jspdf;

            html2canvas(dashboardContent).then(canvas => {
                const pdf = new jsPDF("p", "mm", "a4");
                const imgData = canvas.toDataURL("image/png");

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                pdf.save("dashboard-medicos.pdf");
            });
        });
    }

    const shareBtn = document.getElementById("shareDashboardMedBtn");
    if (shareBtn) {
        shareBtn.addEventListener("click", () => window.print());
    }

});
