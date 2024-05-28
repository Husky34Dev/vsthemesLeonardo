import json

def extraer_por_color(archivo_json, color_code):
    # Leer el archivo JSON
    with open(archivo_json, 'r') as file:
        data = json.load(file)
    
    resultado = {
        "semanticTokenColors": {},
        "tokenColors": []
    }
    
    # Revisar semanticTokenColors
    for key, value in data.get("semanticTokenColors", {}).items():
        if value.get("foreground") == color_code:
            resultado["semanticTokenColors"][key] = value
    
    # Revisar tokenColors
    for item in data.get("tokenColors", []):
        if item.get("settings", {}).get("foreground") == color_code:
            resultado["tokenColors"].append(item)
    
    return json.dumps(resultado, indent=2)

# Ejemplo de uso
archivo_json = 'background.json'
color_code = "#479645"
nuevo_json = extraer_por_color(archivo_json, color_code)

# Guardar el resultado en un nuevo archivo
with open('extracciones/backgroundExtracted.json', 'w') as file:
    file.write(nuevo_json)
