from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from starlette.middleware.cors import CORSMiddleware
import time

app = FastAPI(

)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # 모든 오리진 허용
    allow_credentials=True,  # 자격 증명 사용 시 True로 설정
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


class RequestModel(BaseModel):
    prompt: str
    model: str = "llama3"
    stream: bool = False


@app.get("/")
async def check_status():
    return {"Hello FastAPI !!"}


@app.get("/status")
async def check_status():
    return {"status": "API is running"}


@app.post("/generate/")
async def generate_text(request: RequestModel):
    start_time = time.time()

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": request.model,
                "prompt": request.prompt,
                "stream": request.stream
            }
        )
        response.raise_for_status()

        elapsed_time = time.time() - start_time
        result = response.json()
        return {
            "response": result,
            "elapsed_time": elapsed_time
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
