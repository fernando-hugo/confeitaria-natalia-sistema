import pandas as pd
from supabase import create_client

# Configuração Anubis Tech
URL = "https://neduutvqxkbuzznnmxa.supabase.co"
KEY = "sb_publishable_oT7iPe9hIOUhNS_-vbCP8w_w4AwB6rK" # Use a Service Role Key para o Python
supabase = create_client(URL, KEY)

def gerar_previsao_financeira():
    # 1. Busca os lançamentos reais
    response = supabase.table("financial_records").select("*").execute()
    df = pd.DataFrame(response.data)

    if df.empty:
        return "Sem dados para análise."

    # 2. Converte valores e datas
    df['amount'] = pd.to_numeric(df['amount'])
    df['due_date'] = pd.to_datetime(df['due_date'])

    # 3. Inteligência: Separa Entradas de Saídas
    entradas = df[df['amount'] > 0]
    media_diaria = entradas['amount'].sum() / 30 # Média baseada em 30 dias

    # 4. Resultado Estratégico
    previsao_proximo_mes = media_diaria * 30
    return {
        "previsao_faturamento": round(previsao_proximo_mes, 2),
        "status_saude": "Estável" if previsao_proximo_mes > 0 else "Alerta"
    }

if __name__ == "__main__":
    resultado = gerar_previsao_financeira()
    print(f"--- RELATÓRIO ANUBIS INTELLIGENCE ---")
    print(f"Previsão de Faturamento: R$ {resultado['previsao_faturamento']}")