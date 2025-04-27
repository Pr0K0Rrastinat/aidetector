# services/model_service.py
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_NAME = "Asyq/kaz-lang-human-vs-ai-v1"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

def predict(text: str):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    output = model(**inputs)
    logits = output.logits
    probs = torch.nn.functional.softmax(logits, dim=1)
    probs_percent = probs * 100
    return probs_percent
