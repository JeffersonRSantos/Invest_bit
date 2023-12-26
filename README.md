## InvestBit 💲

<p>InvestBit é uma wallet que tem por objetivo oferecer agilidade na compra e venda de Bitcoin. Com essa carteira é possível consultar: saldos, operações, cotação e extrato, e ela oferece também a forma de fazer depósitos em Reais(BRL) para cateria e fácil processo de compra e venda de Cripto-ativos</p>

-------------

**Projeto desenvolvido com os seguintes padrões:**

- POO (Programação Orientada a Objetos)
- S.O.L.I.D
- Clean Architecture

Breve conceito S.O.L.I.D:

```
S — Single Responsiblity Principle (Princípio da responsabilidade única)
O — Open-Closed Principle (Princípio Aberto-Fechado)
L — Liskov Substitution Principle (Princípio da substituição de Liskov)
I — Interface Segregation Principle (Princípio da Segregação da Interface)
D — Dependency Inversion Principle (Princípio da inversão da dependência)
```

- <a href="https://www.techtarget.com/whatis/definition/clean-architecture" target="_blank">Mais sobre Clean Architecture</a>

### 🚀▶- Execute o projeto rodando:

```
cp ./.env.example ./.env (execute na raiz do projeto e atualize o arquivo com suas credenciais de ambiente)
```

**❌🐳 - Sem docker**

*Recomenda-se que para os serviços mínimos, eles sejam iniciados via docker, como: Mysql, Redis e Rabbitmq

```
yarn (instale todas as dependências)
```

```
knex migrate:latest (crie as tabelas no banco de dados )
```

```
yarn dev (execute a aplicação "sem docker")
```

**✅🐳 - Com docker**

<p>Não esqueça de ter configurado o docker em sua máquina ;)</p>

```
docker-compose up -d
```

<p>Com os containers no AR, execute:</p>

```
docker exec -it application_container knex migrate:latest
```

<p>Para executar os testes, execute:</p>

```
docker exec -it application_container yarn test
```

### 🚀🛤 - Rotas
	- (POST) {URL}/_login - (no auth)
	- (POST) {URL}/_register - (no auth)
	- (POST) {URL}/_deposit/new - (require auth)
	- (GET) {URL}/_deposit/:transaction_id/details - (require auth)
	- (GET) {URL}/_wallet/balance - (require auth)
	- (GET) {URL}/_wallet/btc/cotation - (require auth)
	- (GET) {URL}/_wallet/transactions - (require auth)
	- (GET) {URL}/_wallet/extract/:interval? - (require auth)
	- (POST) {URL}/_wallet/btc/purchase - (require auth)
	- (POST) {URL}/_wallet/btc/sell - (require auth)
	

obs: (collection anexada na raiz do projeto)

### 🚀🪧- Testes unitários

- Em cada *useCase* é possível realizar o teste unitário do tipo *(E2E)* para testar qualquer regra de negócio.
Use o comando:

```
yarn test
```

### 🚀↗ - Passos para melhorias:

1. Etapa de melhorias - 

- Enviar um email ao cliente caso a transação de Buy/Sell não seja bem sucedida.
- Criar uma fila para falhas como: Notificação, depósito, compra e venda
- Implementar ElasticSearch para os logs
- Tranformar a API principal em um gateway
- Adicionar mais opções criptomoedas para compra/venda
- Transformar alguns serviços em microservices, como: (Email e ConsumerOfQueue)
- Com base na segregação de MS, passar a usar Exchanges no Kabbitmq para melhor distribuição des filas

------------------------------------------

### 🚀🎲 - Estrutura (migrations) Mysql

```
- tb_users
	- id (auto-increment)
	- name_full
	- e-mail (unique)
	- password (encrypt)

- tb_transactions
	- id (auto-increment)
	- user_id (foreignKey on tb_users.id)
	- transaction_id (auto-increment/unique)
	- value (double)
	- btc_last_cotation (double)
	- btc_equivalent (double)
	- transaction_type (integer)
	- transaction_status (integer)

- tb_wallet
	- id (auto-increment)
	- user_id (foreignKey on tb_users.id)
	- balance_brl (double)
	- balance_btc (double)
	- active_credit_card (bool)

- tb_notifications
	- id (auto-increment)
	- user_id (foreignKey on tb_users.id)
	- content_notification (varchar)
	- method_send (integer)
	- status_send (integer)

- tb_queue_logs
	- id (auto-increment)
	- queue_id (auto-increment/unique)
	- status (integer)
	- payload (longtext)

- tb_request_logs
	- id (auto-increment)
	- request_id (auto-increment/unique)
	- endpoint (varchar)
	- method (integer)
	- status (integer)
	- payload (longtext)
```
