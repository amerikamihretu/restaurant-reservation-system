export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const csrfToken = () => typeof document === 'undefined' ? '' : document.cookie.split('; ').find((item) => item.startsWith('rr_csrf='))?.split('=')[1] || '';

export async function apiFetch(endpoint, options = {}, retried = false) {
    const { data, headers, ...customConfig } = options;
    const config = {
        method: options.method || 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken(), ...headers },
        ...customConfig,
    };
    if (data !== undefined) config.body = JSON.stringify(data);
    let response = await fetch(`/api/v1${endpoint}`, config);
    if (response.status === 401 && !retried && !endpoint.startsWith('/auth/')) {
        const refreshResponse = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken() } });
        if (refreshResponse.ok) response = await fetch(`/api/v1${endpoint}`, config);
    }
    const contentType = response.headers.get('content-type') || '';
    const responseData = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) throw new ApiError(typeof responseData === 'object' && responseData?.message ? responseData.message : `HTTP error! status: ${response.status}`, response.status, responseData);
    return responseData;
}
