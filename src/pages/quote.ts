import type { APIRoute } from "astro";
import { formatDate } from "@/lib/util";

function getParameterByName(url: string, name: string) {
  name = name.replace(/[\[\]]/g, "\\$&");
  name = name.replace(/\//g, "");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

  if (!results) return null;
  else if (!results[2]) return "";
  else if (results[2]) {
    results[2] = results[2].replace(/\//g, "");
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function fetchQuote(date?: string) {
  try {
    const url = "http://open.iciba.com/dsapi/" + (date ? `?${new URLSearchParams({ date })}` : "");
    const res = await fetch(url);
    if (!res.ok) return { status: false };

    const result = await res.json();
    return {
      status: true,
      data: {
        date: result.dateline,
        en: result.content,
        zh: result.note,
        img: result.picture2,
        preview: result.picture,
      },
    };
  } catch (error) {
    return { status: false };
  }
}

export const get: APIRoute = async ({ request }) => {
  const rawDate = getParameterByName(request.url, "date") || new Date().toISOString();

  if (isNaN(Date.parse(rawDate)) || new Date(rawDate) > new Date()) {
    return new Response(JSON.stringify({ status: false, message: "Invalid date!" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const date = formatDate(rawDate).split(" ")[0];

  const result = await fetchQuote(date);

  return new Response(JSON.stringify(result), {
    status: result.status ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
};
