import { handleResponse } from "../handleResponse";
import { promiseTimeout } from "../promiseTimeout";

export async function getFetcher(
  _url: string,
  preventFast?: boolean,
  params?: Record<string, string>
) {
  const token = sessionStorage.getItem("token");

  const urlParams = params ? "?" + new URLSearchParams(params).toString() : "";
  const url = import.meta.env.PUBLIC_SERVER + _url + urlParams;

  const response = await promiseTimeout(
    preventFast ? 500 : 0,
    10000,
    fetch(url, {
      headers: token
        ? {
            Authorization: "Bearer " + token,
          }
        : undefined,
      method: "GET",
    })
  );
  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || `Status ${response.status} - ${_url}`
  );

  return result.data;
}
