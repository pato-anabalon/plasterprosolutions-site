export function createJsonRequest(body: unknown, headers?: HeadersInit) {
  return new Request("https://www.plasterprosolution.co.nz/api/test", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    method: "POST",
  });
}

export const validQuotePayload = {
  address: "5B Kegworth Place, Auckland, 0630, New Zealand",
  company: "Nodo",
  email: "pato.anabalon@gmail.com",
  files: [],
  firstName: "Patricio",
  lastName: "Anabalon",
  message: "Test quote with files added to the form",
  page: "/contact",
  phone: "+64274160934",
  source: "Website",
  subject: "Test with files",
  uploadFolder: "",
  website: "",
};
