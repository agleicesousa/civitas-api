# **CIVITAS API | Projeto Back-end do Orion Bootcamp 2024**

![Node.js](https://img.shields.io/badge/Node.js-339933.svg?&style=flat&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?&style=flat&logo=typescript&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED.svg?&style=flat&logo=docker&logoColor=white)

Projeto desenvolvido durante o **Orion Bootcamp** da New Rizon para gerenciar usuários, PDIs e turmas, com diferentes níveis de permissão para **admins**, **professores** e **alunos**.

## **Sumário**

- [Descrição](#descrição)
- [Instalação](#instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Clonar o Repositório](#clonar-o-repositório)
  - [Instalar Dependências](#instalar-dependências)
  - [Configuração do Ambiente](#configuração-do-ambiente)
  - [Rodar a Aplicação](#rodar-a-aplicação)
- [Uso](#uso)
  - [Admin Master](#admin-master)
  - [Permissões](#permissões)
- [Documentação](#documentação)
- [TSDoc](#tsdoc)
- [Contribuição](#contribuição)
- [Créditos](#créditos)
- [Licença](#licença)

## **Descrição**

Este projeto é uma aplicação **Node.js** utilizando **TypeScript**, com suporte opcional para **Docker**. Ele permite o gerenciamento de usuários, PDIs e turmas, com diferentes níveis de permissão para **admins**, **professores** e **alunos**.

## **Instalação**

### **Pré-requisitos**

- ![Node.js](https://img.shields.io/badge/Node.js-339933.svg?&style=flat&logo=node.js&logoColor=white) **Node.js**: Versão 20 ou superior.
- ![npm](https://img.shields.io/badge/npm-CC3534.svg?&style=flat&logo=npm&logoColor=white) **npm**.
- ![MySQL](https://img.shields.io/badge/MySQL-F29111.svg?&style=flat&logo=mysql&logoColor=white) **MySQL**.
- ![Docker](https://img.shields.io/badge/Docker-2496ED.svg?&style=flat&logo=docker&logoColor=white) (opcional).

### **Clonar o Repositório**

Primeiro, clone o repositório para o seu ambiente local:

```bash
git clone https://github.com/agleicesousa/civitas-api.git
cd civitas-api
```

### **Instalar Dependências**

Para instalar as dependências do projeto, execute:

```bash
npm install
```

### **Configuração do Ambiente**

Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` e preencha com suas próprias configurações:

```dotenv
# Configurações do banco de dados MySQL
DB_HOST=localhost                # Endereço do servidor de banco de dados (pode ser 'localhost' ou o nome do container se estiver usando Docker)
DB_USER=root                     # Nome de usuário para acessar o banco de dados
DB_PORT=3306                     # Porta do banco de dados (porta padrão do MySQL)
DB_PASSWORD=MinhaSenhaForte      # Senha para o usuário de banco de dados
DB_ROOT_PASSWORD=SenhaRoot       # Senha do usuário root do banco de dados
DB_DATABASE=meu_database         # Nome do banco de dados a ser utilizado pela aplicação

# Configurações de autenticação JWT
JWT_SECRET=MinhaChaveSecreta     # Chave secreta para assinatura dos tokens JWT
SECRET_KEY=OutraSenhaSuperSecreta # Chave adicional para segurança da aplicação (pode ser utilizada para criptografias internas)
ALGORITHM=aes-256-ctr            # Algoritmo de criptografia utilizado para gerar tokens JWT (padrão: aes-256-ctr)

# Configurações do administrador inicial (admin master)
ADMIN_PASSWORD=SenhaAdmin123     # Senha do administrador principal (admin master) após o primeiro login
ADMIN_EMAIL=admin@dominio.com    # E-mail do administrador principal
```

### **Rodar a Aplicação**

#### **Com Docker**

Se você preferir usar Docker, execute:

```bash
docker-compose up
```

#### **Sem Docker**

Caso não use Docker, execute a aplicação com:

```bash
npm run start:dev
```

## **Uso**

### **Admin Master**

Após executar a aplicação, um **Admin Master** será criado automaticamente com permissões especiais para:

- Criar e gerenciar outros admins
- Criar e gerenciar professores, alunos e turmas
- Criar e gerenciar PDIs

### **Permissões**

- **Professores**:
  - Podem cadastrar, visualizar e editar PDIs.
  - Podem visualizar os alunos e turmas aos quais estão associados.
- **Alunos**:
  - Podem apenas visualizar seus próprios PDIs.
- **Admins**:
  - Podem gerenciar usuários e turmas que eles próprios criaram.

## **Documentação**

Este projeto usa **Swagger** para documentar as funcionalidades da API. Após executar a aplicação, acesse a documentação através da URL:

```
http://localhost:porta/swagger
```

## **TSDoc**

O código do projeto é documentado usando **TSDoc**, o que fornece uma documentação clara e estruturada para facilitar a compreensão e manutenção do código.

## **Contribuição**

Contribuições são bem-vindas! Para mudanças significativas, abra uma issue primeiro para discutir as alterações que você gostaria de implementar. Caso tenha sugestões ou melhorias, sinta-se à vontade para enviar pull requests.

## **Créditos**

Este projeto foi desenvolvido durante o **Orion Bootcamp da New Rizon**. Agradecimentos especiais aos participantes:

### Mentor:

- [Luiz Miguel Jarduli](https://www.linkedin.com/in/luiz-jarduli/)
- [Fabrício Lindenmeyer](https://www.linkedin.com/in/fabricio-lindenmeyer/)

### Product Owner:

- [Rafael Ornelas](https://www.linkedin.com/in/rafael-ornelas/)
- [Alessandra Valverde](https://www.linkedin.com/in/alessandra-valverde-91696736/)

### Back-End:

- [Agleice Sousa](https://www.linkedin.com/in/agleice-sousa/)
- [Darlison Bernardo](https://www.linkedin.com/in/darlisonbernardo/)

### Front-End:

- [Felipe C. Silva](https://www.linkedin.com/in/ggfelipesilva/)

## **Licença**

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
