const fetchToken = async (serviceUrl: string) => {
  const tokenFetch = await fetch(
    `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${serviceUrl}`,
    {
      method: 'GET',
      headers: {
        'Metadata-Flavor': 'Google',
      },
    },
  );
  return await tokenFetch.text();
};

type Props<T> = {
  serviceUrl: string;
  api: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: T;
};

export const apiRequest = async <T, B = T>({
  serviceUrl,
  api,
  method,
  body,
}: Props<T>): Promise<B> => {
  // TODO - check token expiration date
  const url = `${serviceUrl}/${api}`;
  console.info('Request', { url, method, body });

  let headers: HeadersInit = {};
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    const token = await fetchToken(serviceUrl);
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  if (body) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
  }
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
  });

  if (response.ok) {
    return (await response.json()) as B;
  } else {
    return Promise.reject(await response.json());
  }
};
