# 📚 Gerador de Plano de Aula Interativo

Uma aplicação web desenvolvida para facilitar a organização do planejamento pedagógico, permitindo que professores estruturem suas aulas de maneira prática, dinâmica e organizada.

O sistema possibilita configurar informações da turma, disciplina e período letivo, gerar semanas e aulas automaticamente, registrar conteúdos e objetivos de aprendizagem e acompanhar todo o planejamento em uma única interface.

## 🌐 Acesse o projeto

**[Abrir Gerador de Plano de Aula](https://tainara-m.github.io/Plano-de-Aula/)**

## 💡 Sobre o projeto

O **Gerador de Plano de Aula Interativo** foi desenvolvido como projeto de estudo e portfólio, com a proposta de utilizar a programação para solucionar uma necessidade presente na rotina docente: organizar o planejamento das aulas.

A aplicação oferece uma estrutura dinâmica na qual o professor pode configurar o período de planejamento e preencher as informações de cada aula, mantendo os dados salvos no próprio navegador.

O desenvolvimento contou com o auxílio do **ChatGPT**, utilizado como ferramenta de apoio na implementação de funcionalidades em JavaScript, organização do código e melhorias de responsividade.

## ✨ Funcionalidades

### ⚙️ Configuração do planejamento

- Seleção da turma: 1º, 2º ou 3º ano;
- Seleção do trimestre;
- Identificação da disciplina;
- Campo para nome do professor;
- Definição do ano letivo;
- Configuração da quantidade de semanas;
- Definição da quantidade de aulas por semana.

### 📅 Organização das semanas e aulas

- Geração dinâmica da estrutura de planejamento;
- Organização das aulas por semana;
- Registro da data de cada aula;
- Seleção da metodologia de ensino;
- Registro do conteúdo trabalhado;
- Definição dos recursos didáticos;
- Registro dos objetivos de aprendizagem;
- Opções para expandir ou recolher as aulas;
- Possibilidade de duplicar e excluir semanas.

### 💾 Salvamento de informações

- Salvamento automático dos dados;
- Salvamento manual pelo botão disponível na interface;
- Atalho de teclado `Ctrl + S`;
- Recuperação das informações ao abrir novamente a aplicação no mesmo navegador;
- Indicador visual do estado do salvamento;
- Opção para limpar o conteúdo mediante confirmação.

Os dados são armazenados localmente por meio do `localStorage` do navegador.

### 📄 Geração de PDF

- Geração de uma versão organizada do planejamento;
- Abertura de uma página própria para impressão;
- Formatação específica para impressão;
- Possibilidade de salvar o planejamento em PDF utilizando a opção de impressão do navegador.

### 🎨 Interface e experiência de uso

- Layout responsivo;
- Design com efeito glassmorphism;
- Fundo com animação interativa;
- Elementos visuais personalizados;
- Fonte personalizada;
- Suporte à preferência de redução de movimento do dispositivo.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| HTML5 | Estrutura da aplicação e formulários |
| CSS3 | Estilização, responsividade e efeitos visuais |
| JavaScript | Lógica, interatividade e manipulação dinâmica dos elementos |
| LocalStorage | Armazenamento local dos planejamentos |
| GitHub Pages | Hospedagem da aplicação |

O projeto utiliza JavaScript puro (*Vanilla JavaScript*), sem necessidade de frameworks ou bibliotecas externas para executar suas funcionalidades principais.

## 📁 Estrutura do projeto

```text
Plano-de-Aula/
│
├── index.html
├── styles.css
├── script.js
├── README.md
│
└── assets/
    ├── ChettaVissto.ttf
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── apple-touch-icon.png
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon.ico
    └── site.webmanifest
```

## 🚀 Como executar

A aplicação é uma página web estática e não exige instalação de dependências.

1. Faça o download ou clone o repositório.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` em um navegador atualizado.

Para clonar o repositório:

```bash
git clone https://github.com/Tainara-m/Plano-de-Aula.git
```

Também é possível utilizar diretamente a versão publicada no GitHub Pages.

## 🧠 Conceitos de programação aplicados

Durante o desenvolvimento, foram trabalhados conceitos importantes de desenvolvimento web:

- Estruturação de páginas com HTML5;
- Estilização e responsividade com CSS3;
- Manipulação do DOM;
- Criação e reutilização de elementos HTML com templates;
- Manipulação de eventos;
- Organização de funções JavaScript;
- Gerenciamento de estado da aplicação;
- Armazenamento de dados com LocalStorage;
- Salvamento automático com controle de tempo (*debounce*);
- Manipulação e geração de conteúdo para impressão;
- Organização e separação de responsabilidades entre arquivos.

## 🔮 Possíveis melhorias futuras

- Sistema para armazenar vários planejamentos independentes;
- Integração com banco de dados;
- Personalização de modelos de planejamento;
- Alternância entre temas claro e escuro;
- Aprimoramentos na exportação dos documentos.

## 👩‍💻 Autoria e desenvolvimento

**Desenvolvido por Tainara Martins.**

O projeto foi desenvolvido com auxílio do **ChatGPT**, utilizado como ferramenta de apoio na implementação de funcionalidades JavaScript, organização da aplicação e melhorias de responsividade.

A utilização da inteligência artificial fez parte do processo de desenvolvimento, com revisão e adaptação do resultado ao objetivo proposto.

## 📄 Licença

Este projeto disponibiliza seu código-fonte sob a licença MIT, respeitando os direitos e as licenças aplicáveis aos recursos de terceiros utilizados.

Consulte o arquivo `LICENSE` para conhecer os termos de utilização.
