const gatewayListContainer = document.getElementById('gateway-list-container');

const ALL_GATEWAYS_QUERY = `
    query {
        allGateways {
            id
            name
            address
            port
            isActive
            connectionString
            isLocal
            createdAt
            updatedAt
            desc
        }
    }
`;

// render messages
function renderMessage(type, text) {
    gatewayListContainer.innerHTML = `
        <div class="message-box ${type}">
            <p>${text}</p>
        </div>
    `;
}

// fetch data from GraphQL
async function fetchGraphQL(query, variables = {}) {
    try {
        const response = await fetch('http://localhost:8000/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query, variables}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result.data;
    } catch (e) {
        throw e;
    }
}

// render the list of gateways
async function renderGatewayList() {
    renderMessage('loading', 'loading gateways');
    try {
        const data = await fetchGraphQL(ALL_GATEWAYS_QUERY);
        const gateways = data.allGateways;

        if (gateways.length === 0) {
            renderMessage('no-data', 'No Gateway found. You can create a new Gateway via the admin panel or GraphQL.');
            return;
        }

        let listHtml = '<div class="gateway-list">';
        gateways.forEach(gateway => {
            listHtml += `
                <div class="gateway-item" data-id="${gateway.id}">
                    <div class="gateway-name">${gateway.name}</div>
                    <div class="gateway-id">${gateway.id}</div>
                    <div class="gateway-address">${gateway.address}:${gateway.port}</div>
                    <div class="gateway-status ${gateway.isActive ? 'active' : 'inactive'}">
                            ${gateway.isActive ? 'active' : 'inactive'}
                    </div>
                </div>
            `;
        });
        listHtml += '</div>';
        gatewayListContainer.innerHTML = listHtml;

        document.querySelectorAll('.gateway-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const id = event.currentTarget.dataset.id;
                window.location.href = `/gateway/${id}/`;
            });
        });

    } catch (e) {
        renderMessage('error', `error in loading gateways: ${e.message}`);
        console.error("Error fetching gateways:", e);
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderGatewayList);
