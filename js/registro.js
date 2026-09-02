// =========================
// REGISTRO DE USUARIO
// =========================

const formulario = document.getElementById("formRegistro");

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        let esValido = true;

        // Obtener valores
        const run = document.getElementById("run").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos")?.value.trim() || "";
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value;
        const confirmarPassword = document.getElementById("confirmPassword").value;
        const telefono = document.getElementById("telefono").value.trim();
        const region = document.getElementById("region").value;
        const comuna = document.getElementById("comuna").value;
        const direccion = document.getElementById("direccion")?.value.trim() || "";
        const tipoUsuario = document.getElementById("tipoUsuario")?.value || "cliente";
        const fechaNacimiento = document.getElementById("fechaNacimiento")?.value || "";

        // =========================
        // VALIDAR RUN (formato chileno)
        // =========================
        function validarRun(run) {
            if (!run) return false;
            if (!/^[0-9]+[0-9K]$/.test(run)) return false;

            const cuerpo = run.slice(0, -1);
            const dv = run.slice(-1);

            let suma = 0;
            let multiplo = 2;

            for (let i = cuerpo.length - 1; i >= 0; i--) {
                suma += parseInt(cuerpo[i]) * multiplo;
                multiplo = multiplo === 7 ? 2 : multiplo + 1;
            }

            const resto = suma % 11;
            const dvCalculado = 11 - resto;

            let dvEsperado;
            if (dvCalculado === 11) dvEsperado = '0';
            else if (dvCalculado === 10) dvEsperado = 'K';
            else dvEsperado = dvCalculado.toString();

            return dv === dvEsperado;
        }

        // =========================
        // VALIDAR CORREO
        // =========================
        function validarCorreo(correo) {
            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            return dominiosPermitidos.some(dom => correo.includes(dom));
        }

        // =========================
        // VALIDAR RUN
        // =========================
        if (!validarRun(run)) {
            alert("❌ RUN inválido. Debe tener el formato: 12345678K (sin puntos ni guión)");
            esValido = false;
        }

        // =========================
        // VALIDAR NOMBRE
        // =========================
        if (!nombre || nombre.length < 1 || nombre.length > 50) {
            alert("❌ El nombre es requerido (máx 50 caracteres)");
            esValido = false;
        }

        // =========================
        // VALIDAR APELLIDOS (si existe el campo)
        // =========================
        if (document.getElementById("apellidos") && (!apellidos || apellidos.length < 1 || apellidos.length > 100)) {
            alert("❌ Los apellidos son requeridos (máx 100 caracteres)");
            esValido = false;
        }

        // =========================
        // VALIDAR CORREO
        // =========================
        if (!validarCorreo(correo)) {
            alert("❌ Correo inválido. Solo se permiten: @duoc.cl, @profesor.duoc.cl, @gmail.com");
            esValido = false;
        }

        // =========================
        // VALIDAR CONTRASEÑA (4-10 caracteres)
        // =========================
        if (password.length < 4 || password.length > 10) {
            alert("❌ La contraseña debe tener entre 4 y 10 caracteres");
            esValido = false;
        }

        // =========================
        // VALIDAR CONFIRMAR CONTRASEÑA
        // =========================
        if (password !== confirmarPassword) {
            alert("❌ Las contraseñas no coinciden");
            esValido = false;
        }

        // =========================
        // VALIDAR REGIÓN Y COMUNA
        // =========================
        if (!region) {
            alert("❌ Debes seleccionar una región");
            esValido = false;
        }

        if (!comuna) {
            alert("❌ Debes seleccionar una comuna");
            esValido = false;
        }

        // =========================
        // VALIDAR DIRECCIÓN (si existe el campo)
        // =========================
        if (document.getElementById("direccion") && (!direccion || direccion.length < 1 || direccion.length > 300)) {
            alert("❌ La dirección es requerida (máx 300 caracteres)");
            esValido = false;
        }

        // =========================
        // VALIDAR TÉRMINOS
        // =========================
        const terminos = document.getElementById("terminos");
        if (terminos && !terminos.checked) {
            alert("❌ Debes aceptar los términos y condiciones");
            esValido = false;
        }

        // =========================
        // SI TODO ES VÁLIDO
        // =========================
        if (esValido) {
            const datosUsuario = {
                run: run,
                nombre: nombre,
                apellidos: apellidos,
                correo: correo,
                password: password, // En producción, ¡NUNCA guardes contraseñas en texto plano!
                telefono: telefono,
                region: region,
                comuna: comuna,
                direccion: direccion,
                tipoUsuario: tipoUsuario,
                fechaNacimiento: fechaNacimiento,
                fechaRegistro: new Date().toISOString()
            };

            console.log("✅ Usuario registrado:", datosUsuario);

            // Guardar en localStorage
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios.push(datosUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert("✅ ¡Usuario registrado correctamente! Bienvenido a LEVEL-UP GAMER 🚀");

            // Limpiar formulario
            formulario.reset();

            // Resetear comunas (si existe el select)
            const selectComuna = document.getElementById("comuna");
            if (selectComuna) {
                selectComuna.innerHTML = '<option value="">Selecciona tu comuna</option>';
            }
        }
    });
}

// =========================
// REGIONES Y COMUNAS DINÁMICAS
// =========================

// Datos de regiones y comunas
const regiones = [{
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "Vitacura", "Providencia", "Ñuñoa", "Peñalolén", "San Miguel", "La Reina", "Macul"]
}, {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Concón", "Quintero", "Limache", "Olmue"]
}, {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel", "Hualpén", "San Pedro de la Paz", "Chiguayante"]
}, {
    nombre: "Región de La Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Lautaro", "Nueva Imperial"]
}, {
    nombre: "Región de Los Lagos",
    comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas", "Frutillar", "Llanquihue"]
}, {
    nombre: "Región de Tarapacá",
    comunas: ["Iquique", "Alto Hospicio", "Pica", "Huara", "Pozo Almonte"]
}, {
    nombre: "Región de Antofagasta",
    comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "San Pedro de Atacama"]
}, {
    nombre: "Región de Atacama",
    comunas: ["Copiapó", "Vallenar", "Huasco", "Caldera", "Chañaral"]
}, {
    nombre: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Ovalle", "Vicuña", "Illapel", "Andacollo"]
}, {
    nombre: "Región de O'Higgins",
    comunas: ["Rancagua", "San Fernando", "Santa Cruz", "Pichilemu", "Rengo"]
}, {
    nombre: "Región del Maule",
    comunas: ["Talca", "Curicó", "Linares", "Constitución", "Parral", "Cauquenes"]
}, {
    nombre: "Región de Ñuble",
    comunas: ["Chillán", "Bulnes", "San Carlos", "Quirihue", "Coelemu"]
}, {
    nombre: "Región de Aysén",
    comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"]
}, {
    nombre: "Región de Magallanes",
    comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
}, {
    nombre: "Región de Arica y Parinacota",
    comunas: ["Arica", "Putre", "Camarones"]
}, {
    nombre: "Región de Los Ríos",
    comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"]
}];

// Cargar regiones
const selectRegion = document.getElementById("region");
const selectComuna = document.getElementById("comuna");

if (selectRegion) {
    // Llenar regiones
    regiones.forEach(region => {
        const option = document.createElement("option");
        option.value = region.nombre;
        option.textContent = region.nombre;
        selectRegion.appendChild(option);
    });

    // Evento para cambiar comunas según región
    selectRegion.addEventListener("change", function() {
        const regionSeleccionada = regiones.find(r => r.nombre === this.value);

        // Limpiar comunas
        if (selectComuna) {
            selectComuna.innerHTML = '<option value="">Selecciona tu comuna</option>';

            if (regionSeleccionada) {
                regionSeleccionada.comunas.forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        }
    });
}