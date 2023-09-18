export type HttpRequest = {
  domain: string,
  url: string,
  method: string,
  headers: Record<string, string>,
  body: string,
};
