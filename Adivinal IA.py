# -*- coding: utf-8 -*-


import random
import textwrap

# --- Datos del juego ---

IAs = {
    "chatgpt": {
        "aliases": {"chatgpt", "gpt", "openai chatgpt"},
        "pistas": [
            "Soy un modelo conversacional creado por OpenAI que puede dialogar sobre muchos temas.",
            "Puedo redactar textos, explicar conceptos, escribir código y ayudar a estudiar.",
            "Pertenezco a la familia GPT. ¿Quién soy?"
        ],
        "feedback": (
            "🎉 ¡Correcto! ChatGPT\n\n"
            "Funciones básicas:\n"
            "1) Generación de texto y conversación natural.\n"
            "2) Explicación de conceptos y tutoría.\n"
            "3) Asistencia en redacción y creatividad.\n"
            "4) Ayuda con código y depuración.\n"
        )
    },
    "gemini": {
        "aliases": {"gemini", "google gemini", "bard", "google bard"},
        "pistas": [
            "Soy un asistente de Google que se integra con su ecosistema.",
            "Trabajo con información multimodal (texto, imágenes…)",
            "Antes se me conocía como Bard. ¿Quién soy?"
        ],
        "feedback": (
            "🌟 ¡Bien! Gemini\n\n"
            "Funciones básicas:\n"
            "1) Respuestas contextuales y creativas.\n"
            "2) Soporte multimodal (p. ej., texto e imagen).\n"
            "3) Integración con productos de Google.\n"
            "4) Búsqueda y razonamiento asistido.\n"
        )
    },
    "perplexity": {
        "aliases": {"perplexity", "perplexity ai"},
        "pistas": [
            "Me enfoco en respuestas con citas y fuentes verificables.",
            "Soy un buscador impulsado por IA con transparencia.",
            "Soy conocido por mostrar referencias en cada respuesta. ¿Quién soy?"
        ],
        "feedback": (
            "🧠 ¡Exacto! Perplexity\n\n"
            "Funciones básicas:\n"
            "1) Respuestas con citas y referencias.\n"
            "2) Búsqueda en la web en tiempo real.\n"
            "3) Síntesis precisa y verificable.\n"
            "4) Conversación enfocada en fuentes.\n"
        )
    },
    "claude": {
        "aliases": {"claude", "caude", "claud", "anthropic claude"},
        "pistas": [
            "Fui creado por Anthropic, con foco en seguridad y ética.",
            "Mi nombre rinde homenaje a Claude Shannon.",
            "Se me reconoce por respuestas cuidadosas y claras. ¿Quién soy?"
        ],
        "feedback": (
            "🌈 ¡Muy bien! Claude\n\n"
            "Funciones básicas:\n"
            "1) Conversación clara y útil.\n"
            "2) Enfoque en seguridad y alineamiento.\n"
            "3) Apoyo en escritura y análisis.\n"
            "4) Razonamiento y resumen de información.\n"
        )
    }
}

POSIBLES = ["ChatGPT", "Gemini", "Perplexity", "Claude"]

# --- Utilidades ---

def normaliza(txt: str) -> str:
    """Normaliza la entrada del usuario para comparar."""
    return txt.strip().lower()

def es_acierto(entrada: str, clave: str) -> bool:
    """Verifica si la entrada coincide con la IA (nombre o alias)."""
    e = normaliza(entrada)
    aliases = IAs[clave]["aliases"]
    return e in aliases

def envoltorio(txt: str, ancho: int = 88) -> str:
    return "\n".join(textwrap.wrap(txt, width=ancho))

# --- Juego ---

def jugar():
    print("=== ADIVINA LA IA ===")
    print("Objetivo: adivina las 4 aplicaciones de IA a partir de pistas progresivas.")
    print("Apps posibles: ChatGPT, Gemini, Perplexity, Claude")
    print("Comandos: escribe 'opciones' para ver la lista, 'salir' para terminar.\n")

    # Orden aleatorio de las IAs
    claves = list(IAs.keys())
    random.shuffle(claves)

    puntos = 0
    acertadas = []

    for clave in claves:
        nombre_mostrable = clave.capitalize() if clave != "chatgpt" else "ChatGPT"
        pistas = IAs[clave]["pistas"]

        print(f"\n--- Adivina la IA Adivina, incluidas: ChatGPT, Gemini, Perplexity, Claude ---")
        for idx, pista in enumerate(pistas, start=1):
            print(f"Pista {idx}: {pista}")
            entrada = input("Tu respuesta (o 'opciones' / 'salir'): ")
            e = normaliza(entrada)
            if e == "salir":
                print("Saliendo del juego. ¡Hasta luego!")
                return
            if e == "opciones":
                print("Opciones posibles:", ", ".join(POSIBLES))
                continue
            if es_acierto(entrada, clave):
                puntos += 1
                print("\n" + envoltorio(IAs[clave]["feedback"]))
                acertadas.append(nombre_mostrable)
                break
            else:
                print("Incorrecto. Intenta de nuevo.\n")
        else:
            print(f"No adivinaste. La respuesta correcta era: {nombre_mostrable}\n")

    print("\n=== RESULTADOS ===")
    print(f"Puntuación: {puntos} / {len(IAs)}")
    if acertadas:
        print("Adivinadas:", ", ".join(acertadas))
    else:
        print("No acertaste ninguna.")
    print("Gracias por jugar.")

if __name__ == '__main__':
    jugar()

