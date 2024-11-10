import { HttpResponse } from '@/response/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('HttpResponse', () => {
  it('should create text response', async () => {
    const response = new HttpResponse();
    const result = response.text('Hello World').build();

    expect(result.status).toBe(200);
    expect(result.headers.get('Content-Type')).toBe(
      'text/plain; charset=UTF-8',
    );
    expect(result.headers.get('Accept')).toBe('text/plain');
    expect(await result.text()).toBe('Hello World');
  });

  it('should create HTML response', async () => {
    const response = new HttpResponse();
    const html = '<h1>Hello World</h1>';
    const result = response.html(html).build();

    expect(result.status).toBe(200);
    expect(result.headers.get('Content-Type')).toBe('text/html; charset=UTF-8');
    expect(result.headers.get('Accept')).toBe('text/html');
    expect(await result.text()).toBe(html);
  });

  it('should create JSON response', async () => {
    const response = new HttpResponse();
    const data = { message: 'Hello World' };
    const result = response.json(data).build();

    expect(result.status).toBe(200);
    expect(result.headers.get('Content-Type')).toBe(
      'application/json; charset=UTF-8',
    );
    expect(result.headers.get('Accept')).toBe('application/json');

    const responseBody = await result.json();
    expect(responseBody.data).toEqual(data);
    expect(responseBody.state.success).toBe(true);
    expect(responseBody.state.status).toBe(200);
  });

  it('should create error response', async () => {
    const response = new HttpResponse();
    const errorMessage = 'Something went wrong';
    const errorData = { detail: 'Error details' };
    const result = response.exception(errorMessage, errorData, 500).build();

    expect(result.status).toBe(500);
    expect(result.headers.get('Content-Type')).toBe(
      'application/json; charset=UTF-8',
    );

    const responseBody = await result.json();
    expect(responseBody.message).toBe(errorMessage);
    expect(responseBody.data).toEqual(errorData);
    expect(responseBody.state.success).toBe(false);
    expect(responseBody.state.status).toBe(500);
  });

  it('should create not found response', async () => {
    const response = new HttpResponse();
    const result = response.notFound('Resource not found').build();

    expect(result.status).toBe(404);
    const responseBody = await result.json();
    expect(responseBody.message).toBe('Resource not found');
    expect(responseBody.state.success).toBe(false);
  });

  it('should create redirect response', () => {
    const response = new HttpResponse();
    const result = response.redirect('https://example.com');

    expect(result.status).toBe(307);
    expect(result.headers.get('Location')).toBe('https://example.com/');
  });
});
