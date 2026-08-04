#!/usr/bin/env bash
# Passo 1 do G8: emite UMA NF-e de homologação na Focus e espera o retorno da SEFAZ.
#
# Existe para descobrir a lista REAL de campos obrigatórios. Os campos do schema
# saíram de levantamento, não de uma nota que passou — a SEFAZ é a única fonte
# que vale. Rode, leia a rejeição, ajuste, repita.
#
#   FOCUS_TOKEN=xxx CNPJ_EMITENTE=00000000000000 bash scripts/nfe-homologacao.sh
#
# ponytail: curl e jq, sem client novo. É script de descoberta, roda a mão e
# morre quando a emissão de verdade existir em src/. Não vira dependência de nada.
set -euo pipefail

: "${FOCUS_TOKEN:?defina FOCUS_TOKEN (Painel API > Tokens > homologação)}"
: "${CNPJ_EMITENTE:?defina CNPJ_EMITENTE (só números, 14 dígitos)}"

BASE="https://homologacao.focusnfe.com.br"
REF="orion-homolog-$(date +%s)"

# A SEFAZ REJEITA (erro 613) qualquer nota de homologação cujo destinatário não
# tenha exatamente esta razão social. Não "melhore" este texto.
DEST="NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"

payload() {
  cat <<JSON
{
  "natureza_operacao": "Venda de mercadoria",
  "data_emissao": "$(date -u +%Y-%m-%dT%H:%M:%S-03:00)",
  "tipo_documento": 1,
  "finalidade_emissao": 1,
  "consumidor_final": 1,
  "presenca_comprador": 1,
  "local_destino": 1,
  "modalidade_frete": 9,
  "cnpj_emitente": "${CNPJ_EMITENTE}",
  "nome_destinatario": "${DEST}",
  "cpf_destinatario": "84706712339",
  "indicador_inscricao_estadual_destinatario": 9,
  "logradouro_destinatario": "Rua Teste",
  "numero_destinatario": "100",
  "bairro_destinatario": "Centro",
  "municipio_destinatario": "Cascavel",
  "uf_destinatario": "PR",
  "cep_destinatario": "85810010",
  "valor_produtos": 10.00,
  "valor_total": 10.00,
  "items": [
    {
      "numero_item": 1,
      "codigo_produto": "TESTE-001",
      "descricao": "PRODUTO TESTE HOMOLOGACAO",
      "cfop": "5102",
      "unidade_comercial": "UN",
      "quantidade_comercial": 1,
      "valor_unitario_comercial": 10.00,
      "unidade_tributavel": "UN",
      "quantidade_tributavel": 1,
      "valor_unitario_tributavel": 10.00,
      "valor_bruto": 10.00,
      "codigo_ncm": "94036000",
      "inclui_no_total": 1,
      "icms_origem": 0,
      "icms_situacao_tributaria": "102",
      "pis_situacao_tributaria": "07",
      "cofins_situacao_tributaria": "07"
    }
  ]
}
JSON
}

echo "== POST /v2/nfe?ref=${REF}"
ENVIO=$(payload | curl -s -u "${FOCUS_TOKEN}:" -X POST \
  -H "Content-Type: application/json" --data @- \
  "${BASE}/v2/nfe?ref=${REF}")
printf '%s\n' "$ENVIO"

# Recusa na porta (certificado ausente, campo faltando) não gera nota nenhuma:
# sem isto o loop abaixo consulta por 150s uma referência que não existe.
if printf '%s' "$ENVIO" | grep -q '"codigo"'; then
  echo
  echo "A API recusou o envio. Não há o que consultar — resolva o erro acima."
  exit 1
fi

echo
echo "== consultando até a SEFAZ responder (assíncrono, pode levar minutos)"
for _ in $(seq 1 30); do
  RESP=$(curl -s -u "${FOCUS_TOKEN}:" "${BASE}/v2/nfe/${REF}")
  STATUS=$(printf '%s' "$RESP" | sed -n 's/.*"status":"\([^"]*\)".*/\1/p')
  echo "   status=${STATUS:-?}"
  case "$STATUS" in
    processando_autorizacao|"") sleep 5 ;;
    *) printf '%s\n' "$RESP"; break ;;
  esac
done

echo
echo "Rejeitou? A mensagem da SEFAZ diz o campo que falta — é exatamente essa"
echo "lista que os passos 2 a 4 precisam ter certos. ref=${REF}"
