const pdfFile = document.getElementById("pdfFile");
const convertBtn = document.getElementById("convertBtn");
const imagesDiv = document.getElementById("images");

convertBtn.addEventListener("click", () => {
    if (!pdfFile.files[0]) {
        alert("Please select a PDF file first!");
        return;
    }
    const file = pdfFile.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            imagesDiv.innerHTML = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then(page => {
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        const img = document.createElement("img");
                        img.src = canvas.toDataURL("image/jpeg");
                        imagesDiv.appendChild(img);
                    });
                });
            }
        });
    };

    fileReader.readAsArrayBuffer(file);
});
