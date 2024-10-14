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
                const appointmentItem = document.createElement('div');
                appointmentItem.classList.add('appointment-item');
                appointmentItem.innerHTML = `
                    <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                    <p><strong>Responsável:</strong> ${appointment.responsible}</p>
                    <p><strong>Idade:</strong> ${appointment.age}</p>
                    <p><strong>Telefone:</strong> ${appointment.phone}</p>
                    <p><strong>Especialista:</strong> ${appointment.specialistName} (${appointment.specialistType})</p>
                    <p><strong>Consultório:</strong> ${appointment.consultorio}</p>
                    <p><strong>Data:</strong> ${appointment.appointmentDate}</p>
                    <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
                    <button class="edit-btn" data-index="${index}">Alterar</button>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                `;
                todayConsultationsContainer.appendChild(appointmentItem);
            });
        }

        todayConsultationsContainer.classList.remove('hidden');
        classifiedConsultationsContainer.classList.add('hidden');
    }

    function showMonthlyAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const months = Array.from({ length: 12 }, (_, i) => i + 1); // Meses de 1 a 12
        const monthlyContainer = document.getElementById('monthly-consultations');

        monthlyContainer.innerHTML = ''; // Limpar consultas anteriores

        months.forEach(month => {
            const monthHeader = document.createElement('div');
            monthHeader.classList.add('month-header');
            monthHeader.innerHTML = `<span>Mês ${month}</span> <span class="arrow">▼</span>`;

            const appointmentList = document.createElement('div');
            appointmentList.classList.add('appointment-list');

            const appointmentsForMonth = appointments.filter(appointment => {
                const appointmentMonth = new Date(appointment.appointmentDate).getMonth() + 1;
                return appointmentMonth === month;
            });

            if (appointmentsForMonth.length > 0) {
                appointmentsForMonth.forEach((appointment, index) => {
                    const appointmentItem = document.createElement('div');
                    appointmentItem.classList.add('appointment-item');
                    appointmentItem.innerHTML = `
                        <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                        <p><strong>Responsável:</strong> ${appointment.responsible}</p>
                        <p><strong>Idade:</strong> ${appointment.age}</p>
                        <p><strong>Telefone:</strong> ${appointment.phone}</p>
                        <p><strong>Especialista:</strong> ${appointment.specialistName} (${appointment.specialistType})</p>
                        <p><strong>Consultório:</strong> ${appointment.consultorio}</p>
                        <p><strong>Data:</strong> ${appointment.appointmentDate}</p>
                        <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
                        <button class="edit-btn" data-index="${index}">Alterar</button>
                        <button class="delete-btn" data-index="${index}">Excluir</button>
                    `;
                    appointmentList.appendChild(appointmentItem);
                });
            } else {
                appointmentList.innerHTML = `<p>Nenhuma consulta encontrada para o Mês ${month}.</p>`;
            }

            monthHeader.addEventListener('click', function () {
                appointmentList.style.display = appointmentList.style.display === 'none' ? 'block' : 'none';
                const arrow = monthHeader.querySelector('.arrow');
                arrow.classList.toggle('arrow-rotated');
            });

            monthlyContainer.appendChild(monthHeader);
            monthlyContainer.appendChild(appointmentList);
        });

        monthlyContainer.classList.remove('hidden');
        todayConsultationsContainer.classList.add('hidden');
    }

    function classifyAppointments() {
        const day = classifyDayInput.value;
        const month = classifyMonthInput.value;
        const year = classifyYearInput.value;

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const classifiedAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);
            return appointmentDate.getDate() == day &&
                (appointmentDate.getMonth() + 1) == month &&
                appointmentDate.getFullYear() == year;
        });

        classifiedConsultationsContainer.innerHTML = ''; // Limpar consultas anteriores

        if (classifiedAppointments.length === 0) {
            classifiedConsultationsContainer.innerHTML = '<p>Nenhuma consulta encontrada para essa data.</p>';
        } else {
            classifiedAppointments.forEach((appointment, index) => {
                const appointmentItem = document.createElement('div');
                appointmentItem.classList.add('appointment-item');
                appointmentItem.innerHTML = `
                    <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                    <p><strong>Responsável:</strong> ${appointment.responsible}</p>
                    <p><strong>Idade:</strong> ${appointment.age}</p>
                    <p><strong>Telefone:</strong> ${appointment.phone}</p>
                    <p><strong>Especialista:</strong> ${appointment.specialistName} (${appointment.specialistType})</p>
                    <p><strong>Consultório:</strong> ${appointment.consultorio}</p>
                    <p><strong>Data:</strong> ${appointment.appointmentDate}</p>
                    <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
                    <button class="edit-btn" data-index="${index}">Alterar</button>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                `;
                classifiedConsultationsContainer.appendChild(appointmentItem);
            });
        }

        classifiedConsultationsContainer.classList.remove('hidden');
    }

    // Funções de alterar e excluir consultas
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.getAttribute('data-index');
            editAppointment(index);
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            deleteAppointment(index);
        }
    });

    function editAppointment(index) {
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

        editingIndex = index;
    }

    function deleteAppointment(index) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.splice(index, 1);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        showTodayAppointments();
    }
});
            