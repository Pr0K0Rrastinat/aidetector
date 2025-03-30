from fastapi import FastAPI
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import requests
import os

router = FastAPI()

API_URL = "http://localhost:8000/result/by-filename/"

def generate_pdf(filename: str, ai_percentage: float):
    pdf_path = f"{filename}_report.pdf"
    c = canvas.Canvas(pdf_path, pagesize=A4)
    c.setFont("Helvetica", 14)

    c.drawString(100, 750, "AI Detection Report")
    c.drawString(100, 730, f"File: {filename}")
    c.drawString(100, 710, f"AI Probability: {ai_percentage}%")
    
    c.drawString(100, 680, "Our service has analyzed this file for AI-generated content.")
    c.drawString(100, 660, "The percentage indicates the likelihood of AI usage.")

    c.showPage()
    c.save()

    return pdf_path
