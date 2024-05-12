export async function getRaidData(clanTag: string) {
    const url = `https://cocproxy.royaleapi.dev/v1/clans/%23${clanTag.replace(
        "#",
        ""
    )}/capitalraidseasons?limit=1`;

    const headers = {
        Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjVhMmY3NmFmLThiMmItNDdiNi1iMTBkLThhMTBmMTM4MjUzMSIsImlhdCI6MTcwNDY1NjczNSwic3ViIjoiZGV2ZWxvcGVyL2E2Njc2NTM1LTAwYzAtM2M1ZC1mMDdlLWU5ZWQyYjNkMzBkOCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1Ljc5LjIxOC43OSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.etswA4KyliwT1YBQLrCrP4vplzJH3B5HLVy9JI49BWaj80Yk6NLn2b_0jjhe3ifUhhpUGOasrU6Iwjcx9e1UNg",
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
