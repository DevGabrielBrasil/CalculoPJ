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

// Gerar PDF com o resumo
function gerarPDF() {
    const resultadoDiv = document.getElementById("resultado");
    if (!resultadoDiv || resultadoDiv.innerHTML.trim() === "") {
        alert("Nenhum resumo gerado para exportar!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.html(resultadoDiv, {
        callback: function (doc) {
            doc.save("Resumo.pdf");
        },
        x: 10,
        y: 10,
    });
}

// Redirecionar para a página de soma de PDFs
function irParaSomaPDF() {
    window.location.href = "index.html";
}

