document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointment-form');
    const todayTab = document.getElementById('today-tab');
    const appointmentsTab = document.getElementById('appointments-tab');
    const todayConsultationsContainer = document.getElementById('today-consultations');
    const classifiedConsultationsContainer = document.getElementById('classified-consultations');
    const classifyDayInput = document.getElementById('classify-day');
    const classifyMonthInput = document.getElementById('classify-month');
    const classifyYearInput = document.getElementById('classify-year');
    const classifyBtn = document.getElementById('classify-btn');

    let editingIndex = null;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newAppointment = {
            patientName: document.getElementById('patient-name').value,
            responsible: document.getElementById('responsible').value,
            age: document.getElementById('age').value,
            phone: document.getElementById('phone').value,
            specialistType: document.getElementById('specialist-type').value,
            specialistName: document.getElementById('specialist-name').value,
            recommendations: document.getElementById('recommendations').value,
            consultorio: document.getElementById('consultorio').value,
            appointmentDate: document.getElementById('appointment-date').value,
            appointmentTime: document.getElementById('appointment-time').value,
        };

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        if (editingIndex !== null) {
            appointments[editingIndex] = newAppointment; // Alterar a consulta existente
            editingIndex = null;
        } else {
            appointments.push(newAppointment); // Adicionar nova consulta
        }

        localStorage.setItem('appointments', JSON.stringify(appointments));
        form.reset();
        showTodayAppointments(); // Atualizar as consultas do dia
    });

    todayTab.addEventListener('click', showTodayAppointments);
    appointmentsTab.addEventListener('click', showMonthlyAppointments);
    classifyBtn.addEventListener('click', classifyAppointments);

    function showTodayAppointments() {
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const todayAppointments = appointments.filter(appointment => appointment.appointmentDate === today);
        todayAppointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)); // Ordenar por horário

        todayConsultationsContainer.innerHTML = ''; // Limpar conteúdo existente
        if (todayAppointments.length === 0) {
            todayConsultationsContainer.innerHTML = '<p>Nenhuma consulta encontrada para hoje.</p>';
        } else {
            todayAppointments.forEach((appointment, index) => {
                const div = document.createElement('div');
                div.classList.add('appointment-item');
                div.innerHTML = `
                    <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                    <p><strong>Responsável:</strong> ${appointment.responsible}</p>
                    <p><strong>Idade:</strong> ${appointment.age}</p>
                    <p><strong>Telefone:</strong> ${appointment.phone}</p>
                    <p><strong>Especialista:</strong> ${appointment.specialistType} - ${appointment.specialistName}</p>
                    <p><strong>Consultório:</strong> ${appointment.consultorio}</p>
                    <p><strong>Recomendações:</strong> ${appointment.recommendations}</p>
                    <p><strong>Data da Consulta:</strong> ${appointment.appointmentDate}</p>
                    <p><strong>Horário:</strong> ${appointment.appointmentTime}</p>
                    <button onclick="editAppointment(${index})">Alterar</button>
                    <button onclick="deleteAppointment(${index})">Excluir</button>
                `;
                todayConsultationsContainer.appendChild(div);
            });
        }
        todayConsultationsContainer.classList.remove('hidden');
        classifiedConsultationsContainer.classList.add('hidden');
    }

    function showMonthlyAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const months = Array.from({length: 12}, (_, i) => appointments.filter(app => new Date(app.appointmentDate).getMonth() === i));
        const monthlyContainer = document.getElementById('monthly-consultations');
        monthlyContainer.innerHTML = '';

        months.forEach((appointments, monthIndex) => {
            const monthDiv = document.createElement('div');
            monthDiv.innerHTML = `<h4>Mês ${monthIndex + 1}</h4>`;
            if (appointments.length === 0) {
                monthDiv.innerHTML += '<p>Nenhuma consulta encontrada para este mês.</p>';
            } else {
                appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)); // Ordenar por data
                appointments.forEach((appointment, index) => {
                    const div = document.createElement('div');
                    div.classList.add('appointment-item');
                    div.innerHTML = `
                        <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                        <p><strong>Data da Consulta:</strong> ${appointment.appointmentDate}</p>
                        <p><strong>Horário:</strong> ${appointment.appointmentTime}</p>
                        <button onclick="editAppointment(${index})">Alterar</button>
                        <button onclick="deleteAppointment(${index})">Excluir</button>
                    `;
                    monthDiv.appendChild(div);
                });
            }
            monthlyContainer.appendChild(monthDiv);
        });

        monthlyContainer.classList.remove('hidden');
        todayConsultationsContainer.classList.add('hidden');
        classifiedConsultationsContainer.classList.add('hidden');
    }

    function classifyAppointments() {
        const day = classifyDayInput.value;
        const month = classifyMonthInput.value - 1; // De 1 a 12 para 0 a 11
        const year = classifyYearInput.value;

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const classifiedAppointments = appointments.filter(app => {
            const date = new Date(app.appointmentDate);
            return date.getDate() === Number(day) && date.getMonth() === month && date.getFullYear() === Number(year);
        });
        classifiedAppointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)); // Ordenar por horário

        classifiedConsultationsContainer.innerHTML = ''; // Limpar conteúdo existente
        if (classifiedAppointments.length === 0) {
            classifiedConsultationsContainer.innerHTML = '<p>Nenhuma consulta encontrada para esta classificação.</p>';
        } else {
            classifiedAppointments.forEach((appointment, index) => {
                const div = document.createElement('div');
                div.classList.add('appointment-item');
                div.innerHTML = `
                    <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                    <p><strong>Responsável:</strong> ${appointment.responsible}</p>
                    <p><strong>Idade:</strong> ${appointment.age}</p>
                    <p><strong>Telefone:</strong> ${appointment.phone}</p>
                    <p><strong>Especialista:</strong> ${appointment.specialistType} - ${appointment.specialistName}</p>
                    <p><strong>Consultório:</strong> ${appointment.consultorio}</p>
                    <p><strong>Recomendações:</strong> ${appointment.recommendations}</p>
                    <p><strong>Data da Consulta:</strong> ${appointment.appointmentDate}</p>
                    <p><strong>Horário:</strong> ${appointment.appointmentTime}</p>
                    <button onclick="editAppointment(${index})">Alterar</button>
                    <button onclick="deleteAppointment(${index})">Excluir</button>
                `;
                classifiedConsultationsContainer.appendChild(div);
            });
        }
        classifiedConsultationsContainer.classList.remove('hidden');
        todayConsultationsContainer.classList.add('hidden');
        document.getElementById('monthly-consultations').classList.add('hidden');
    }

    window.editAppointment = function(index) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const appointment = appointments[index];

        document.getElementById('patient-name').value = appointment.patientName;
        document.getElementById('responsible').value = appointment.responsible;
        document.getElementById('age').value = appointment.age;
        document.getElementById('phone').value = appointment.phone;
        document.getElementById('specialist-type').value = appointment.specialistType;
        document.getElementById('specialist-name').value = appointment.specialistName;
        document.getElementById('recommendations').value = appointment.recommendations;
        document.getElementById('consultorio').value = appointment.consultorio;
        document.getElementById('appointment-date').value = appointment.appointmentDate;
        document.getElementById('appointment-time').value = appointment.appointmentTime;

        editingIndex = index; // Salvar o índice para edição
    };

    window.deleteAppointment = function(index) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.splice(index, 1); // Remover a consulta
        localStorage.setItem('appointments', JSON.stringify(appointments));
        showTodayAppointments(); // Atualizar a lista de consultas
        showMonthlyAppointments(); // Atualizar a lista de consultas mensais
    };
});
