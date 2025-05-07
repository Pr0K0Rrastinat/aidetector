import os
from sqlalchemy.orm import Session
from models import TrainingData  
import torch
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    Trainer, TrainingArguments, DataCollatorWithPadding
)
from datasets import Dataset

MODEL_NAME = "Asyq/kaz-lang-human-vs-ai-v1"
MODEL_DIR = "./models/finetuned"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

def predict(text: str):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    output = model(**inputs)
    probs = float(torch.nn.functional.softmax(output.logits, dim=1)[0, 1])
    return probs * 100

св 
def train_model_from_db(db: Session):
    entries = db.query(TrainingData).all()
    train_data = []

    for entry in entries:
        if not os.path.exists(entry.filepath):
            continue
        try:
            with open(entry.filepath, "r", encoding="utf-8") as f:
                text = f.read()
                label = 1 if entry.filetype == "ai" else 0
                train_data.append({"text": text, "label": label})
        except Exception as e:
            print(f"Ошибка при чтении файла {entry.filepath}: {e}")

    if not train_data:
        return {"error": "Нет подходящих данных для обучения"}

    dataset = Dataset.from_list(train_data)
    dataset = dataset.map(lambda e: tokenizer(e['text'], truncation=True), batched=True)
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    training_args = TrainingArguments(
        output_dir=MODEL_DIR,
        evaluation_strategy="no",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        num_train_epochs=3,
        weight_decay=0.01,
        save_strategy="no",
        logging_steps=10
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        tokenizer=tokenizer,
        data_collator=data_collator,
    )

    trainer.train()

    # 5. Сохраняем модель
    model.save_pretrained(MODEL_DIR)
    tokenizer.save_pretrained(MODEL_DIR)

    return {"message": f"Обучено на {len(train_data)} файлах и сохранено в {MODEL_DIR}"}
