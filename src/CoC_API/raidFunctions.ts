import { COC_API_TOKEN } from "../Discord_Bot/config.js";

export async function getRaidData(clanTag: string) {
    const url = `https://cocproxy.royaleapi.dev/v1/clans/%23${clanTag.replace(
        "#",
        ""
    )}/capitalraidseasons?limit=1`;

    const headers = {
        Authorization: `Bearer ${COC_API_TOKEN}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
