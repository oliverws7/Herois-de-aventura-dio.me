class Heroi {
    constructor(nome, idade, tipo) {
        this.nome = nome;
        this.idade = idade;
        this.tipo = tipo;
        this.nivel = 1;
        this.pontosVida = 100;
        this.pontosAtaque = this.calcularAtaqueBase();
        this.inventario = [];
    }

    calcularAtaqueBase() {
        const ataquesBase = {
            mago: 15,
            guerreiro: 25,
            monge: 20,
            ninja: 30
        };
        return ataquesBase[this.tipo] || 10;
    }

    atacar() {
        const ataques = {
            mago: 'usou magia',
            guerreiro: 'usou espada',
            monge: 'usou artes marciais',
            ninja: 'usou shuriken'
        };

        const ataque = ataques[this.tipo] || 'usou um ataque desconhecido';
        const dano = Math.floor(this.pontosAtaque * (0.9 + Math.random() * 0.2));
        
        const mensagem = `O ${this.tipo} ${this.nome} atacou usando ${ataque} e causou ${dano} de dano!`;
        adicionarLog(mensagem, this.tipo);
        return dano;
    }

    receberDano(dano) {
        this.pontosVida -= dano;
        const mensagem = `${this.nome} recebeu ${dano} de dano! Vida restante: ${this.pontosVida}`;
        adicionarLog(mensagem, this.tipo);
        
        if (this.pontosVida <= 0) {
            const mensagemDerrota = `⚰️ ${this.nome} foi derrotado!`;
            adicionarLog(mensagemDerrota, this.tipo);
        }
        atualizarStatus();
    }

    subirNivel() {
        this.nivel++;
        this.pontosAtaque = Math.floor(this.calcularAtaqueBase() * (1 + this.nivel * 0.1));
        this.pontosVida += 20;
        const mensagem = `🎉 ${this.nome} subiu para o nível ${this.nivel}! Ataque: ${this.pontosAtaque}, Vida: ${this.pontosVida}`;
        adicionarLog(mensagem, this.tipo);
        atualizarStatus();
    }

    adicionarItem(item) {
        this.inventario.push(item);
        const mensagem = `🛍️ ${this.nome} adquiriu ${item.nome} (${item.tipo})`;
        adicionarLog(mensagem, this.tipo);
        
        if (item.tipo === 'equipamento') {
            this.pontosAtaque += item.bonusAtaque || 0;
            this.pontosVida += item.bonusVida || 0;
        }
        atualizarStatus();
    }

    usarHabilidadeEspecial() {
        const habilidades = {
            mago: () => {
                const cura = Math.floor(this.pontosVida * 0.3);
                this.pontosVida += cura;
                const mensagem = `✨ ${this.nome} usou cura mágica e recuperou ${cura} de vida!`;
                adicionarLog(mensagem, this.tipo);
            },
            guerreiro: () => {
                const dano = this.pontosAtaque * 1.5;
                const mensagem = `⚔️ ${this.nome} usou golpe poderoso causando ${dano} de dano!`;
                adicionarLog(mensagem, this.tipo);
                return dano;
            },
            monge: () => {
                const mensagem = `🧘 ${this.nome} entrou em estado de meditação, aumentando sua defesa!`;
                adicionarLog(mensagem, this.tipo);
            },
            ninja: () => {
                const mensagem = `🥷 ${this.nome} desapareceu na névoa, evitando o próximo ataque!`;
                adicionarLog(mensagem, this.tipo);
            }
        };

        if (habilidades[this.tipo]) {
            return habilidades[this.tipo]();
        }
        adicionarLog(`${this.nome} tentou usar uma habilidade, mas nada aconteceu...`, this.tipo);
        return 0;
    }

    getStatus() {
        return `
            <p><strong>Nome:</strong> <span class="${this.tipo}">${this.nome}</span></p>
            <p><strong>Tipo:</strong> <span class="${this.tipo}">${this.tipo}</span></p>
            <p><strong>Nível:</strong> ${this.nivel}</p>
            <p><strong>Idade:</strong> ${this.idade}</p>
            <p><strong>Vida:</strong> ${this.pontosVida}</p>
            <p><strong>Ataque:</strong> ${this.pontosAtaque}</p>
            <p><strong>Itens:</strong> ${this.inventario.map(item => item.nome).join(', ') || 'Nenhum'}</p>
        `;
    }
}

class Item {
    constructor(nome, tipo, bonusAtaque = 0, bonusVida = 0) {
        this.nome = nome;
        this.tipo = tipo;
        this.bonusAtaque = bonusAtaque;
        this.bonusVida = bonusVida;
    }
}

// Variáveis globais
const herois = [];
const itensDisponiveis = [
    new Item('Poção de Vida', 'consumivel', 0, 30),
    new Item('Espada Mágica', 'equipamento', 15, 0),
    new Item('Capa da Sombra', 'equipamento', 10, 20),
    new Item('Anel do Poder', 'equipamento', 20, 10),
    new Item('Poção de Força', 'consumivel', 10, 0)
];
let heroiSelecionado = null;

// Elementos do DOM
const heroForm = document.getElementById('heroForm');
const heroSelect = document.getElementById('heroSelect');
const actionBtn = document.getElementById('actionBtn');
const attackBtn = document.getElementById('attackBtn');
const specialBtn = document.getElementById('specialBtn');
const levelUpBtn = document.getElementById('levelUpBtn');
const itemSelect = document.getElementById('itemSelect');
const addItemBtn = document.getElementById('addItemBtn');
const statusDisplay = document.getElementById('statusDisplay');
const logDisplay = document.getElementById('logDisplay');

// Funções auxiliares
function adicionarLog(mensagem, tipo = '') {
    const logEntry = document.createElement('p');
    if (tipo) logEntry.classList.add(tipo);
    logEntry.textContent = mensagem;
    logDisplay.appendChild(logEntry);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

function atualizarStatus() {
    if (heroiSelecionado) {
        statusDisplay.innerHTML = heroiSelecionado.getStatus();
    } else {
        statusDisplay.innerHTML = '<p>Nenhum herói selecionado</p>';
    }
}

function atualizarListaHerois() {
    heroSelect.innerHTML = herois.length > 0 
        ? '<option value="">Selecione um herói...</option>' 
        : '<option value="">Nenhum herói criado</option>';

    herois.forEach((heroi, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${heroi.nome} (${heroi.tipo}, nível ${heroi.nivel})`;
        heroSelect.appendChild(option);
    });

    heroSelect.disabled = herois.length === 0;
    actionBtn.disabled = herois.length === 0;
}

function atualizarListaItens() {
    itemSelect.innerHTML = itensDisponiveis.length > 0
        ? '<option value="">Selecione um item...</option>'
        : '<option value="">Nenhum item disponível</option>';

    itensDisponiveis.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${item.nome} (${item.tipo})`;
        itemSelect.appendChild(option);
    });

    itemSelect.disabled = itensDisponiveis.length === 0 || !heroiSelecionado;
    addItemBtn.disabled = itensDisponiveis.length === 0 || !heroiSelecionado;
}

// Event Listeners
heroForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('heroName').value;
    const idade = parseInt(document.getElementById('heroAge').value);
    const tipo = document.getElementById('heroType').value;
    
    const novoHeroi = new Heroi(nome, idade, tipo);
    herois.push(novoHeroi);
    
    adicionarLog(`Novo herói criado: ${nome} (${tipo})`, tipo);
    atualizarListaHerois();
    
    this.reset();
});

heroSelect.addEventListener('change', function() {
    const selectedIndex = parseInt(this.value);
    
    if (selectedIndex >= 0 && selectedIndex < herois.length) {
        heroiSelecionado = herois[selectedIndex];
        actionBtn.textContent = `Gerenciar ${heroiSelecionado.nome}`;
        
        attackBtn.disabled = false;
        specialBtn.disabled = false;
        levelUpBtn.disabled = false;
        
        atualizarStatus();
        atualizarListaItens();
    } else {
        heroiSelecionado = null;
        actionBtn.textContent = 'Selecione um herói';
        
        attackBtn.disabled = true;
        specialBtn.disabled = true;
        levelUpBtn.disabled = true;
        
        atualizarStatus();
    }
});

attackBtn.addEventListener('click', function() {
    if (heroiSelecionado) {
        const dano = heroiSelecionado.atacar();
        // Simular um inimigo recebendo dano
        setTimeout(() => {
            heroiSelecionado.receberDano(Math.floor(dano * 0.7)); // Inimigo contra-ataca
        }, 1000);
    }
});

specialBtn.addEventListener('click', function() {
    if (heroiSelecionado) {
        const resultado = heroiSelecionado.usarHabilidadeEspecial();
        if (resultado > 0) {
            setTimeout(() => {
                heroiSelecionado.receberDano(Math.floor(resultado * 0.5));
            }, 1000);
        }
    }
});

levelUpBtn.addEventListener('click', function() {
    if (heroiSelecionado) {
        heroiSelecionado.subirNivel();
    }
});

addItemBtn.addEventListener('click', function() {
    if (heroiSelecionado && itemSelect.value !== '') {
        const itemIndex = parseInt(itemSelect.value);
        const item = itensDisponiveis[itemIndex];
        heroiSelecionado.adicionarItem(item);
    }
});

// Inicialização
atualizarListaHerois();
atualizarListaItens();
adicionarLog('Bem-vindo ao Heróis de Aventura! Crie seu primeiro herói para começar.');