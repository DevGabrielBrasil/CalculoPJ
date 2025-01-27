// Formatar valores em reais automaticamente
function formatarReais(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor || 0);
}

// Calcular os dias úteis entre duas datas
function calcularDiasUteis() {
    const dataInicio = new Date(document.getElementById("dataInicio").value);
    const dataFim = new Date(document.getElementById("dataFim").value);

    if (isNaN(dataInicio) || isNaN(dataFim)) {
        document.getElementById("dias-contagem").innerText = 0;
        return;
    }

    let diasUteis = 0;
    for (let d = dataInicio; d <= dataFim; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) diasUteis++; // Exclui sábados e domingos
    }

    document.getElementById("dias-contagem").innerText = diasUteis;
}

// Adicionar uma linha ao histórico
function adicionarAoHistorico(data, salario, valeRefeicao, valeTransporte, total) {
    const tabelaHistorico = document.getElementById("tabela-historico");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${data}</td>
        <td>${formatarReais(salario)}</td>
        <td>${formatarReais(valeRefeicao)}</td>
        <td>${formatarReais(valeTransporte)}</td>
        <td>${formatarReais(total)}</td>
        <td><button class="btn-remover" onclick="removerDoHistorico(this)">Remover</button></td>
    `;

    tabelaHistorico.appendChild(novaLinha);
}

// Remover uma linha do histórico
function removerDoHistorico(botao) {
    const linha = botao.parentElement.parentElement;
    linha.remove();
}

// Realizar o cálculo e exibir os resultados
function calcular() {
    const salario = parseFloat(
        document.getElementById("salario").value.replace(/[^\d,.-]/g, "").replace(",", ".")
    ) || 0;
    const valeRefeicao = parseFloat(
        document.getElementById("valeRefeicao").value.replace(/[^\d,.-]/g, "").replace(",", ".")
    ) || 0;
    const valeTransporte = parseFloat(
        document.getElementById("valeTransporte").value.replace(/[^\d,.-]/g, "").replace(",", ".")
    ) || 0;
    const das = parseFloat(
        document.getElementById("das").value.replace(/[^\d,.-]/g, "").replace(",", ".")
    ) || 0;
    const implantacao = parseFloat(
        document.getElementById("implantacao").value.replace(/[^\d,.-]/g, "").replace(",", ".")
    ) || 0;
    const diasUteis = parseInt(document.getElementById("dias-contagem").innerText) || 0;

    const totalValeRefeicao = diasUteis * valeRefeicao;
    const totalValeTransporte = diasUteis * valeTransporte;
    const total = salario + totalValeRefeicao + totalValeTransporte + das + implantacao;

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <h3>Resumo</h3>
        <p>Salário: ${formatarReais(salario)}</p>
        <p>Vale Refeição (${diasUteis} dias): ${formatarReais(totalValeRefeicao)}</p>
        <p>Vale Transporte (${diasUteis} dias): ${formatarReais(totalValeTransporte)}</p>
        <p>Valor da DAS: ${formatarReais(das)}</p>
        <p>Valor de Implantação: ${formatarReais(implantacao)}</p>
        <p><strong>Total: ${formatarReais(total)}</strong></p>
    `;

    // Adicionar ao histórico
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    adicionarAoHistorico(dataAtual, salario, totalValeRefeicao, totalValeTransporte, total);
}

function gerarPDF() {
    // Verifica se jsPDF foi carregado
    if (!window.jspdf) {
        alert("A biblioteca jsPDF não foi carregada. Verifique se o script está incluído no HTML.");
        return;
    }

    // Captura o resumo gerado no cálculo
    const resultadoDiv = document.getElementById("resultado");

    if (!resultadoDiv || resultadoDiv.innerHTML.trim() === "") {
        alert("Nenhum resumo gerado para exportar!");
        return;
    }

    // Configuração do jsPDF
    const { jsPDF } = window.jspdf; // Importa jsPDF
    const doc = new jsPDF();

    // Insere o conteúdo no PDF
    doc.html(resultadoDiv, {
        callback: function (doc) {
            // Salva o arquivo com o nome "Resumo.pdf"
            doc.save("Resumo.pdf");
        },
        x: 10,
        y: 10,
    });
}

document.getElementById("gerarPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adicionando conteúdo no PDF
    const salario = document.getElementById("salario") ? document.getElementById("salario").value : "Não informado";
    const valeRefeicao = document.getElementById("valeRefeicao") ? document.getElementById("valeRefeicao").value : "Não informado";
    const valeTransporte = document.getElementById("valeTransporte") ? document.getElementById("valeTransporte").value : "Não informado";
    const das = document.getElementById("das") ? document.getElementById("das").value : "Não informado";
    const implantacao = document.getElementById("implantacao") ? document.getElementById("implantacao").value : "Não informado";
    const diasUteis = document.getElementById("dias-contagem") ? document.getElementById("dias-contagem").innerText : "Não informado";

    doc.text("Resumo de Cálculo PJ", 20, 20);
    doc.text(`Salário: ${salario}`, 20, 30);
    doc.text(`Vale Refeição por dia: ${valeRefeicao}`, 20, 40);
    doc.text(`Vale Transporte por dia: ${valeTransporte}`, 20, 50);
    doc.text(`Valor da DAS: ${das}`, 20, 60);
    doc.text(`Valor de Implantação: ${implantacao}`, 20, 70);
    doc.text(`Total de dias úteis: ${diasUteis}`, 20, 80);

    doc.save("resumo_calculo_pj.pdf");
});

function voltarParaCalculoPJ() {
    // Redireciona para a página "Cálculo PJ"
    window.location.href = "index.html"; // Substitua pelo caminho correto da página "Cálculo PJ"
}

document.getElementById("processButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Por favor, selecione ao menos um arquivo PDF.");
        return;
    }

    let totals = {
        Salário: 0,
        "Vale Refeição": 0,
        "Vale Transporte": 0,
        "Valor da DAS": 0,
        "Valor de Implantação": 0,
        Total: 0
    };
    let grandTotal = 0;

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        for (const page of pages) {
            const textContent = await page.getTextContent();
            const text = textContent.items.map((item) => item.str).join(" ");

            // Detectar e somar os valores de cada categoria
            const regexMap = {
                Salário: /Salário:\s*R\$\s*(\d+(?:,\d{2})?)/,
                "Vale Refeição": /Vale Refeição.*?:\s*R\$\s*(\d+(?:,\d{2})?)/,
                "Vale Transporte": /Vale Transporte.*?:\s*R\$\s*(\d+(?:,\d{2})?)/,
                "Valor da DAS": /Valor da DAS:\s*R\$\s*(\d+(?:,\d{2})?)/,
                "Valor de Implantação": /Valor de Implantação:\s*R\$\s*(\d+(?:,\d{2})?)/,
                Total: /Total:\s*R\$\s*(\d+(?:,\d{2})?)/,
            };

            for (const [key, regex] of Object.entries(regexMap)) {
                const match = text.match(regex);
                if (match) {
                    const value = parseFloat(match[1].replace(",", "."));
                    totals[key] += value;
                }
            }
        }
    }

    // Calcular o total geral
    grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

    // Exibir os resultados
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `<strong>Resultados:</strong><br>
        Salário: R$${totals.Salário.toFixed(2)}<br>
        Vale Refeição: R$${totals["Vale Refeição"].toFixed(2)}<br>
        Vale Transporte: R$${totals["Vale Transporte"].toFixed(2)}<br>
        Valor da DAS: R$${totals["Valor da DAS"].toFixed(2)}<br>
        Valor de Implantação: R$${totals["Valor de Implantação"].toFixed(2)}<br>
        <strong>Total (soma de todos):</strong> R$${grandTotal.toFixed(2)}`;
});
