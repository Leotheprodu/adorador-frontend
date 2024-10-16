export async function fetchAPI<TResponse, TBody = undefined>({
  url,
  method = 'GET',
  body = null,
  isFormData = false,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody | FormData | null;
  isFormData?: boolean;
}): Promise<TResponse> {
  // eslint-disable-next-line no-undef
  const config: RequestInit = {
    method,
    credentials: 'include',
    body:
      method === 'GET' || method === 'DELETE' || body === null
        ? undefined
        : isFormData
        ? (body as FormData)
        : JSON.stringify(body),
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
  };

  const response = await fetch(`${url}`, config);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(`${data.statusCode}-${data.message}`);
  }
}
