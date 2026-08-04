#!/usr/bin/env bash
# Passo 1 do módulo NFS-e: emite UMA NFS-e Nacional (DPS) de homologação.
#
# Mesma função do irmão scripts/nfe-homologacao.sh: descobrir a lista real de
# campos obrigatórios antes de construir tela em cima deles. A diferença é que
# este roda com MEI de serviço, que não tem inscrição estadual e por isso nunca
# vai emitir NF-e modelo 55.
#
#   FOCUS_TOKEN=xxx CNPJ_PRESTADOR=57493675000137 COD_MUNICIPIO=5201405 \
#     bash scripts/nfse-homologacao.sh
#
# COD_MUNICIPIO é o IBGE de 7 dígitos (Aparecida de Goiânia/GO = 5201405).
#
# ponytail: curl, como o de NF-e. Script de descoberta, roda a mão, morre quando
# a emissão de verdade existir em src/.
set -euo pipefail

: "${FOCUS_TOKEN:?defina FOCUS_TOKEN (Painel API > Tokens > homologação)}"
: "${CNPJ_PRESTADOR:?defina CNPJ_PRESTADOR (só números, 14 dígitos)}"
: "${COD_MUNICIPIO:?defina COD_MUNICIPIO (código IBGE de 7 dígitos)}"

# Código de tributação nacional do ISSQN — é o "NCM do serviço". O default é
# 17.06 (propaganda e publicidade), que casa com o CNAE 7319-0/02. Se a nota
# for rejeitada por causa dele, é este valor que muda.
COD_ISS="${COD_ISS:-170600}"

# 2 = optante MEI. Ver opcaoSimplesNacional() em src/lib/fiscal.ts.
OPCAO_SN="${OPCAO_SN:-2}"

BASE="https://homologacao.focusnfe.com.br"
REF="orion-nfse-$(date +%s)"

payload() {
  cat <<JSON
{
  "data_emissao": "$(date -u +%Y-%m-%dT%H:%M:%S-0300)",
  "serie_dps": 1,
  "numero_dps": $(date +%s),
  "data_competencia": "$(date -u +%Y-%m-%d)",
  "emitente_dps": 1,
  "codigo_municipio_emissora": ${COD_MUNICIPIO},
  "cnpj_prestador": "${CNPJ_PRESTADOR}",
  "codigo_opcao_simples_nacional": ${OPCAO_SN},
  "regime_especial_tributacao": 0,
  "cpf_tomador": "84706712339",
  "codigo_municipio_prestacao": ${COD_MUNICIPIO},
  "codigo_tributacao_nacional_iss": "${COD_ISS}",
  "descricao_servico": "Nota emitida em carater de TESTE - sem valor fiscal",
  "valor_servico": 1.00,
  "tributacao_iss": 1
}
JSON
}

echo "== POST /v2/nfsen?ref=${REF}"
ENVIO=$(payload | curl -s -u "${FOCUS_TOKEN}:" -X POST \
  -H "Content-Type: application/json" --data @- \
  "${BASE}/v2/nfsen?ref=${REF}")
printf '%s\n' "$ENVIO"

# Recusa na porta (certificado ausente, campo faltando) não gera nota nenhuma:
# sem isto o loop abaixo consulta por 150s uma referência que não existe.
if printf '%s' "$ENVIO" | grep -q '"codigo"'; then
  echo
  echo "A API recusou o envio. Não há o que consultar — resolva o erro acima."
  exit 1
fi

echo
echo "== consultando até a prefeitura/ambiente nacional responder"
for _ in $(seq 1 30); do
  RESP=$(curl -s -u "${FOCUS_TOKEN}:" "${BASE}/v2/nfsen/${REF}")
  STATUS=$(printf '%s' "$RESP" | sed -n 's/.*"status":"\([^"]*\)".*/\1/p')
  echo "   status=${STATUS:-?}"
  case "$STATUS" in
    processando_autorizacao|"") sleep 5 ;;
    *) printf '%s\n' "$RESP"; break ;;
  esac
done

echo
echo "Rejeitou? A mensagem diz o campo — e é essa lista que o módulo precisa"
echo "ter certa antes de virar tela. ref=${REF}"
