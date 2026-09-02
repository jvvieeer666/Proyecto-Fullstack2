const formulario = document.getElementById("formRegistro");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value;

    const correo = document.getElementById("correo").value;

    const password = document.getElementById("password").value;

    const confirmarPassword =
        document.getElementById("confirmPassword").value;

    const telefono =
        document.getElementById("telefono").value;

    const region =
        document.getElementById("region").value;

    const comuna =
        document.getElementById("comuna").value;


    // Validar contraseñas

    if (password !== confirmarPassword) {

        alert("Las contraseñas no coinciden");

        return;
    }


    // Mostrar datos

    console.log("Usuario registrado:");

    console.log("Nombre:", nombre);
    console.log("Correo:", correo);
    console.log("Teléfono:", telefono);
    console.log("Región:", region);
    console.log("Comuna:", comuna);


    alert("Usuario registrado correctamente");


    // Limpiar formulario

    formulario.reset();

});