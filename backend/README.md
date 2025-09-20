# Gateway-Hub

A comprehensive real-time gateway management system built for monitoring and managing network gateways with live log streaming and system metrics.

## Features

### Core Functionality
- **Complete CRUD Operations** - Create, read, update, and delete gateways
- **Real-time System Metrics** - Live CPU usage, memory usage, and system uptime monitoring
- **Live Log Streaming** - Stream logs from multiple gateway services simultaneously
- **Multi-Gateway Monitoring** - Monitor multiple gateways concurrently
- **Advanced Filtering** - Search and filter by various parameters including port ranges

### API Architecture
- **GraphQL API** - Flexible query language with real-time subscriptions
- **Real-time Subscriptions** - GraphQL subscriptions for live data updates
- **gRPC Integration** - High-performance communication with gateway agents

### User Interface
- **Modern Vue.js Frontend** - Responsive design with reactive components
- **Multiple View Modes** - Grid and table views for gateway listings
- **Interactive Dashboards** - Real-time monitoring panels with customizable layouts
- **Export Functionality** - Export gateway data to Excel format

## Tech Stack

### Backend
- **Django** - Web framework with ORM
- **PostgreSQL** - Primary database
- **GraphQL** - Query language with Graphene-Django
- **gRPC** - High-performance RPC framework
- **Django Channels** - WebSocket support
- **Redis** - Channel layer for real-time messaging

### Frontend
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Apollo Client** - GraphQL client with caching
- **WebSocket** - Real-time data streaming
- **Responsive CSS** - Modern UI with mobile-first approach

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Redis 6+

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gateway-hub.git
cd gateway-hub
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
python -m venv venv
```

#### Activate Virtual Environment
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
.\venv\Scripts\activate.bat

# Linux/MacOS
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

#### Environment Variables
Create a `.env` file in the root directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/gateway_hub
REDIS_URL=redis://localhost:6379/0
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

## Running the Application

### Start Backend Server
```bash
# From project root directory
daphne gateway_project.asgi:application
```
The backend will be available at `http://localhost:8000`

### Start Frontend Development Server
```bash
# From frontend directory
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Start Redis Server
```bash
redis-server
```

## Testing

### Run Backend Tests
```bash
python manage.py test gateway_manager.tests
```

### Run All Tests
```bash
python manage.py test
```

## API Documentation

### GraphQL Endpoint
- `POST /graphql/` - GraphQL queries and mutations
- `WS /graphql/` - GraphQL subscriptions for real-time data

### Available GraphQL Operations

#### Queries
```graphql
query GetGateways {
  gateways {
    id
    name
    address
    port
    isActive
    createdAt
  }
}
```

#### Mutations
```graphql
mutation CreateGateway($input: GatewayInput!) {
  createGateway(input: $input) {
    success
    gateway {
      id
      name
      address
      port
    }
    errors
  }
}
```

#### Subscriptions
```graphql
subscription GatewaySystemInfo($gatewayId: ID!) {
  gatewaySystemInfo(gatewayId: $gatewayId) {
    cpuUsage
    memoryUsage
    uptime
    timestamp
  }
}
```

## Project Structure

```
gateway-hub/
├── backend/
│   ├── gateway_project/          # Django project settings
│   ├── gateway_manager/          # Main application
│   │   ├── models.py            # Database models
│   │   ├── schema.py            # GraphQL schema
│   │   ├── consumers.py         # WebSocket consumers
│   │   └── grpc_client.py       # gRPC client implementation
│   ├── requirements.txt         # Python dependencies
│   └── manage.py               # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/         # Vue components
│   │   ├── views/             # Page components
│   │   ├── composables/       # Vue composition functions
│   │   ├── apollo/            # GraphQL client setup
│   │   └── router/            # Vue router configuration
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Build configuration
└── README.md
```

## Development Workflow

This project follows Git flow with feature branches:
- Feature branches: `feature/feature-name`
- Development branch: `dev`
- Main branch: `main`

### Commit Convention
Following conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation updates
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests

## Key Features Demo

### Real-time Monitoring
- Live system metrics with 5-second updates
- Concurrent monitoring of multiple gateways
- Interactive charts and progress indicators

### Log Streaming
- Real-time log streaming from gateway services
- Multiple panel layouts (4 different configurations)
- Log filtering by service type and log level
- Full-screen mode and copy functionality

### Advanced Validation
- IP address validation (IPv4/IPv6)
- Port range validation (1-65535)
- Duplicate gateway prevention
- Comprehensive error handling

## Architecture Highlights

### Real-time Data Flow
```
Gateway → gRPC Server → Python Client → Background Thread 
    → Redis Channel Layer → WebSocket Consumer → Vue.js Frontend
```

### Key Technical Challenges Solved
1. **Cross-process Communication** - Implemented Redis channel layer for threading communication
2. **Memory Management** - Optimized for long-running connections with automatic cleanup
3. **Performance Optimization** - Limited log buffer size and implemented debouncing
4. **Error Handling** - Multi-layer error management from gRPC to UI

## Performance Optimizations

- **Efficient Data Fetching**: GraphQL's flexible querying reduces unnecessary data transfer
- **Memory Management**: Limited concurrent connections and automatic cleanup
- **UI Performance**: Debounced search with 500ms delay
- **Data Limiting**: Maximum 200 log entries per panel

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to the `dev` branch

## Acknowledgments

- Developed during internship at Payam Pardaz Engineering Company
- Special thanks to mentors and team members who provided guidance
- Built as a learning experience in distributed systems and real-time applications
