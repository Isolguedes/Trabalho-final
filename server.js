const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "SUA_CHAVE_OPENAI_AQUI";

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    const systemPrompt = `
Você é o Assistente Escolar.

Documentos: RG, CPF, comprovante de residência, foto 3x4.
Cursos: Técnico em Enfermagem e Desenvolvimento de Sistemas.
Turnos: manhã, tarde e noite.
Notas: 4 pontos de prova, 4 pontos de trabalho em curso e 2 pontos de atividades online.

Se perguntarem sobre módulos, diga apenas para acessar a Área do Aluno.
    `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
     res.json({
  reply: data.choices?.[0]?.message?.content || 
         "Desculpe, não consegui responder agora."
});

    } catch (err) {
        res.status(500).json({ error: "Erro ao conectar com a OpenAI" });
    }
});

app.listen(3000, () => {
    console.log("✅ API rodando em http://localhost:3000");
});