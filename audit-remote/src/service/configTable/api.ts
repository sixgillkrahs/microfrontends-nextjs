export async function createConnector(data: any) {
    return fetch("https://promix.promixhub.com/audit/api/debezium-connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export async function updateConnector(id: string, data: any) {
    return fetch(
        `https://promix.promixhub.com/audit/api/debezium-connectors/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    ).then((res) => res.json());
}

export async function getConnector(pageSize: number = 10, pageIndex: number = 0, sort?: string, search?: string) {
    const res = await fetch(
        `https://promix.promixhub.com/audit/api/debezium-connectors/search?page=${pageIndex}&size=${pageSize}&sort=${sort}&search=${search}`,
        {
            method: "GET",
            headers: { accept: "*/*" },
        }
    );
    const json = await res.json();
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return json;
}


export async function deleteConnector(id: string) {
    const res = await fetch(`https://promix.promixhub.com/audit/api/debezium-connectors/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const err = await res.json();
        debugger
        console.log(err)
        throw new Error(err);
    }

    return res.json().catch(() => ({}));
}
