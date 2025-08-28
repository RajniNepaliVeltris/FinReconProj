import { APIRequestContext } from '@playwright/test';

export async function getRequest(context: APIRequestContext, url: string) {
  const response = await context.get(url);
  if (!response.ok()) {
    throw new Error(`GET request failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function postRequest(context: APIRequestContext, url: string, data: any) {
  const response = await context.post(url, {
    data,
  });
  if (!response.ok()) {
    throw new Error(`POST request failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function putRequest(context: APIRequestContext, url: string, data: any) {
  const response = await context.put(url, {
    data,
  });
  if (!response.ok()) {
    throw new Error(`PUT request failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function deleteRequest(context: APIRequestContext, url: string) {
  const response = await context.delete(url);
  if (!response.ok()) {
    throw new Error(`DELETE request failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}