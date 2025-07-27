const gatewayDetailContainer = document.getElementById('gateway-detail-container');

const GET_GATEWAY_BY_ID_QUERY = `
    query GetGateway($id: String!) {
        gateway(id: $id) {
            id
            name
            address
            port
            desc
            isActive
            connectionString
            isLocal
            createdAt
            updatedAt
        }
    }
`;

function renderMessage(type, text) {
    gatewayDetailContainer.innerHTML = `
        <div class="message-box ${type}">
            <p>${text}</p>
        </div>
    `;
}

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

// get gateway ID from URL
function getGatewayIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[pathParts.length - 2]) {
        return pathParts[pathParts.length - 2];
    }
    return null;
}

// render the detail of a single gateway
async function renderGatewayDetail() {
    const gatewayId = getGatewayIdFromUrl();
    if (!gatewayId) {
        renderMessage('error', 'The requested gateway id was not found in url!');
        return;
    }

    renderMessage('loading', 'load gateway detail...');
    try {
        const data = await fetchGraphQL(GET_GATEWAY_BY_ID_QUERY, {id: gatewayId});
        const gateway = data.gateway;

        if (!gateway) {
            renderMessage('no-data', 'The requested gateway was not found!');
            return;
        }

        gatewayDetailContainer.innerHTML = `
            <div class="gateway-detail-card">
            
                <div class="status-switch">
                    <label class="switch">
                        <input type="checkbox" id="status-checkbox" ${gateway.isActive ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="field-group">
                    <label>ID:</label>
                    <input type="text" value="${gateway.id}" disabled>
                </div>
            
                <div class="field-group">
                    <label>Name:</label>
                    <input type="text" value="${gateway.name}" disabled>
                </div>
            
                <div class="field-group">
                    <label>IP Address:</label>
                    <input type="text" value="${gateway.address}" disabled>
                </div>
            
                <div class="field-group">
                    <label>Port:</label>
                    <input type="text" value="${gateway.port}" disabled>
                </div>
            
                <div class="field-group">
                    <label>Description:</label>
                    <textarea disabled>${gateway.desc || 'None'}</textarea>
                </div>
            
                <div class="field-group-read-only">
                  <label>Connection String:</label>
                  <p class="readonly-field">${gateway.connectionString}</p>
                </div>
                
                <div class="field-group-read-only">
                  <label>Local IP:</label>
                  <span class="status-text ${gateway.isLocal ? 'yse' : 'no'}">
                    ${gateway.isLocal ? 'yes' : 'no'}
                  </span>
                </div>
                
                <div class="field-group-read-only">
                  <label>Created At:</label>
                  <p class="readonly-field">${new Date(gateway.createdAt).toLocaleString()}</p>
                </div>
                
                <div class="field-group-read-only">
                  <label>Updated At:</label>
                  <p class="readonly-field" id="gatewayUpdatedAt">${new Date(gateway.updatedAt).toLocaleString()}</p>
                </div>
            </div>
        `;

         // event listener for the toggle switch
        const toggleSwitch = document.getElementById('status-checkbox');
        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', () => {
                handleToggleStatus(gateway.id);
            });
        }
    } catch (e) {
        renderMessage('error', `error in loading Gateway details: ${e.message}`);
        console.error("Error fetching gateway detail:", e);
    }
}

document.addEventListener('DOMContentLoaded', renderGatewayDetail);

const TOGGLE_GATEWAY_STATUS_MUTATION = `
  mutation ToggleGatewayStatus($id: String!) {
    toggleGateway(id: $id) {
      success
      message
      gateway {
        id
        name
        isActive
        updatedAt
      }
    }
  }
`;

// toggle between status
async function handleToggleStatus(gatewayId) {
    try {
        console.log(11)
        const data = await fetchGraphQL(TOGGLE_GATEWAY_STATUS_MUTATION, {id: gatewayId});
        if (data.toggleGateway.success) {
            console.log(1)
            const updatedGateway = data.toggleGateway.gateway;
            const statusCheckBoxElement = document.getElementById('status-checkbox')
            const gatewayUpdatedAtElement = document.getElementById('gatewayUpdatedAt')
            if(statusCheckBoxElement && gatewayUpdatedAtElement) {
                gatewayUpdatedAtElement.textContent = new Date(updatedGateway.updatedAt).toLocaleString();
            }
        }

    } catch (e) {
        renderMessage('error', `error in toggling Gateway status: ${e.message}`);
        console.error("Error toggling gateway detail:", e);
    }
}

