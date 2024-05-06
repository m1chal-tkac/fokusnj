import { handleResponse } from "../handleResponse";
import { promiseTimeout } from "../promiseTimeout";

export async function putFetcher(
  _url: string,
  params?: Record<string, string>
) {
  const token = sessionStorage.getItem("token");

  const url = import.meta.env.PUBLIC_SERVER + _url;

  const response = await promiseTimeout(
    0,
    10000,
    fetch(url, {
      headers: token
        ? {
            Authorization: "Bearer " + token,
          }
        : undefined,
      method: "PUT",
      body: JSON.stringify(params),
    })
  );
  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || `Status ${response.status} - ${_url}`
  );

  return result.data;
}
