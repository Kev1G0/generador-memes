document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let imagen = null;
    let tipoArchivoImagen = null; // Variable para almacenar el tipo de archivo de la imagen cargada
    let texto = "";
    let fuente = "Arial";
    let tamaño = 20;
    let color = "#000000";
    let estilo = "";
    let textoX = 10; // Posición X inicial del texto
    let textoY = 50; // Posición Y inicial del texto
    let isDragging = false;
    let offsetX, offsetY;

    const imagenInput = document.getElementById("imagenInput");
    const urlInput = document.getElementById("urlInput");
    const cargarURLBtn = document.getElementById("cargarURLBtn");
    const textoInput = document.getElementById("texto");
    const fuenteSelect = document.getElementById("fuente");
    const tamañoInput = document.getElementById("tamaño");
    const colorInput = document.getElementById("color");
    const boldBtn = document.getElementById("boldBtn");
    const italicBtn = document.getElementById("italicBtn");
    const uppercaseBtn = document.getElementById("uppercaseBtn");
    const lowercaseBtn = document.getElementById("lowercaseBtn");
    const strikethroughBtn = document.getElementById("strikethroughBtn");
    const descargarBtn = document.getElementById("descargarBtn");

    imagenInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                cargarImagen(file);
                tipoArchivoImagen = file.type; // Guardar el tipo de archivo de la imagen cargada
            } else {
                alert('Por favor seleccione una imagen JPEG o PNG.');
            }
        }
    });

    cargarURLBtn.addEventListener("click", function() {
        const url = urlInput.value.trim();
        if (url) {
            cargarImagenDesdeURL(url);
        }
    });

    textoInput.addEventListener("input", actualizarTexto);
    fuenteSelect.addEventListener("change", actualizarFuente);
    tamañoInput.addEventListener("input", actualizarTamaño);
    colorInput.addEventListener("input", actualizarColor);
    boldBtn.addEventListener("click", aplicarNegrita);
    italicBtn.addEventListener("click", aplicarCursiva);
    uppercaseBtn.addEventListener("click", aplicarMayuscula);
    lowercaseBtn.addEventListener("click", aplicarMinuscula);
    descargarBtn.addEventListener("click", descargarImagen);

    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    function cargarImagen(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const aspectRatio = img.width / img.height;
                let newWidth, newHeight;
                if (aspectRatio > 1) {
                    newWidth = canvas.width;
                    newHeight = canvas.width / aspectRatio;
                } else {
                    newWidth = canvas.height * aspectRatio;
                    newHeight = canvas.height;
                }
                canvas.width = newWidth * 2; // Ajusta el ancho del canvas al doble del tamaño de la imagen
                canvas.height = newHeight * 2; // Ajusta el alto del canvas al doble del tamaño de la imagen
                imagen = img;
                dibujarCanvas();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function cargarImagenDesdeURL(url) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Permitir el acceso a la imagen desde otro origen (CORS)
        img.onload = function() {
            const aspectRatio = img.width / img.height;
            let newWidth, newHeight;
            if (aspectRatio > 1) {
                newWidth = canvas.width;
                newHeight = canvas.width / aspectRatio;
            } else {
                newWidth = canvas.height * aspectRatio;
                newHeight = canvas.height;
            }
            canvas.width = newWidth * 2; // Ajusta el ancho del canvas al doble del tamaño de la imagen
            canvas.height = newHeight * 2; // Ajusta el alto del canvas al doble del tamaño de la imagen
            imagen = img;
            dibujarCanvas();
        };
        img.src = url;
    }
    

    function actualizarTexto(event) {
        texto = event.target.value;
        dibujarCanvas();
    }

    function actualizarFuente(event) {
        fuente = event.target.value;
        dibujarCanvas();
    }

    function actualizarTamaño(event) {
        tamaño = parseInt(event.target.value);
        dibujarCanvas();
    }

    function actualizarColor(event) {
        color = event.target.value;
        dibujarCanvas();
    }

    function aplicarNegrita() {
        estilo = "bold";
        dibujarCanvas();
    }

    function aplicarCursiva() {
        estilo = "italic";
        dibujarCanvas();
    }

    function aplicarMayuscula() {
        texto = texto.toUpperCase();
        dibujarCanvas();
    }

    function aplicarMinuscula() {
        texto = texto.toLowerCase();
        dibujarCanvas();
    }


    function dibujarCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (imagen) {
            ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
        }
        ctx.font = `${estilo} ${tamaño}px ${fuente}`;
        ctx.fillStyle = color;
        ctx.fillText(texto, textoX, textoY);
    }

    function handleMouseDown(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.min(Math.max(e.clientX - rect.left, 0), canvas.width);
        const mouseY = Math.min(Math.max(e.clientY - rect.top, 0), canvas.height);
    
        // Comprueba si el mouse está dentro de los límites del texto
        if (mouseX >= textoX && mouseX <= textoX + ctx.measureText(texto).width &&
            mouseY >= textoY - tamaño && mouseY <= textoY) {
            isDragging = true;
            offsetX = mouseX - textoX;
            offsetY = mouseY - textoY;
        }
    }
    
    function handleMouseMove(e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = Math.min(Math.max(e.clientX - rect.left, 0), canvas.width);
            const mouseY = Math.min(Math.max(e.clientY - rect.top, 0), canvas.height);
    
            textoX = mouseX - offsetX;
            textoY = mouseY - offsetY;
            dibujarCanvas();
        }
    }
    
    function handleMouseUp() {
        isDragging = false;
    }

    function descargarImagen() {
        const enlace = document.createElement("a");
        enlace.href = canvas.toDataURL(tipoArchivoImagen); // Utilizar el tipo de archivo de la imagen cargada
        enlace.download = "imagen_editada." + tipoArchivoImagen.split('/')[1]; // Establecer la extensión de archivo adecuada
        enlace.click();
    }
    
});
