# Nexus Science Mobile

App do aluno (Expo SDK 57, Expo Router). Funil de cadastro, planos e checkout Asaas, mais as abas Treino, Bio, Pagamentos e Avaliação.

## Rodar

```bash
npm install
cp .env.example .env
npx expo start --web --port 8081
```

No Chrome deste PC: http://localhost:8081. A API precisa estar em `http://localhost:3333` (`EXPO_PUBLIC_API_URL`). Se a 8081 estiver ocupada, use outra porta e inclua ela em `DEV_METRO_PORTS` na API (`src/lib/mobile-origins.ts`) — o better-auth só confia nessas origens em development.

Na web não há SecureStore nem push: a sessão fica no cookie do browser e o app não chama `POST /me/push-token`. Checkout abre a fatura com `window.open`.

`EXPO_PUBLIC_API_URL` default no código é `http://localhost:3333`. No emulador Android use `http://10.0.2.2:3333`. No celular físico use o IP da máquina na rede — `localhost` aponta para o próprio aparelho.

Push remoto de verdade pede um development build, `EXPO_PUBLIC_EAS_PROJECT_ID` e, no servidor, `EXPO_ACCESS_TOKEN`. Sem isso o app abre do mesmo jeito.

Checkout real depende de `ASAAS_API_KEY` na API. O app só abre a `checkoutUrl`; não guarda chave do Asaas.

## Fora desta versão

HealthKit / Health Connect, login Google (botão "em breve"), upload de foto de avaliação e o painel da equipe.
