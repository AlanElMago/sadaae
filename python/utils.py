from requests import Response

def print_json_data(data: dict, indent_level=0) -> None:
    """
    Imprime datos JSON en un formato amigable con sangrías.

    Parameters:
        data (dict): Los datos en formato JSON a imprimir.
        indent_level (int): El nivel de indentación (0 por defecto).
    """
    tab = ' ' * (4 * indent_level)

    for key, value in data.items():
        if isinstance(value, dict):
            print(tab, f"{key}: {{")
            print_json_data(value, indent_level + 1)
            print(tab, '}')

            continue

        print(tab, f"{key}: {value}")

def validate_response(response: Response, status_code: int) -> dict:
    """
    Valida la respuesta de una solicitud HTTP y devuelve los datos JSON si es
    válida.

    Parameters:
        response (requests.Response): La respuesta HTTP a validar.
        status_code (int): El código de estado esperado.

    Returns:
        dict: Los datos JSON de la respuesta si es válida.

    Raises:
        ValueError: Si la respuesta contiene JSON inválido o no tiene el código
            de estado esperado.
    """
    try:
        json = response.json()
    except:
        print("Error")
        print(f"🔢 Status code: {response.status_code}")
        print(f"🤷 Reason: {response.reason}")
        print(f"📄 Text: {response.text}")

        raise ValueError("La respuesta contiene JSON inválido")

    if response.status_code != status_code:
        try:
            message = json['message']
        except KeyError:
            message = response.reason

        print("Error")
        print(f"🔢 Status Code: {response.status_code}")
        print(f"💬 Message: {message}")

        raise ValueError("La respuesta no tiene el código de estado esperado")

    return json
