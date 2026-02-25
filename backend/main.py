from fastapi import FastAPI
from supabase import create_client
import pandas as pd

app = FastAPI()

# Credenciais Anubis Tech (Consulte seu .env.local)
URL = "https://neduutvqxkbuzznnmxa.supabase.co"
KEY = "Ssb_publishable_oT7iPe9hIOUhNS_-vbCP8w_w4AwB6rK" # Use a chave secreta para acesso total
supabase = create_client(URL, KEY)

@app.get("/previsao")
async def obter_previsao():
    # Busca dados reais do banco
    res = supabase.table("financial_records").select("*").execute()
    df = pd.DataFrame(res.data)
    
    if df.empty:
        return {"mensagem": "Sem dados suficientes"}

    # Lógica de Inteligência: Média de faturamento
    df['amount'] = pd.to_numeric(df['amount'])
    entradas = df[df['amount'] > 0]['amount'].sum()
    saidas = df[df['amount'] < 0]['amount'].abs().sum()
    
    return {
        "faturamento_previsto": entradas * 1.1, # Ex: Projeção de 10% de crescimento
        "risco_operacional": "Baixo" if (entradas > saidas) else "Alto",
        "dica_anubis": "Aumentar estoque de insumos" if entradas > 1000 else "Focar em vendas"
    }