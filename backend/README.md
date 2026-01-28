# Pomofocus Business Backend (backend)

> This project is the actual business backend service of Pomofocus app.

---

## Table of Contents

1. [Getting Started](#-Getting-Started)

---

## Getting Started

### Prerequisites

- List all required software, tools and specific version numbers.

### Installation

- Step-by-step guild for cloning the repo and installing.

### Environment Variables

### Running the Project

- Commands to start the application.

## API Endpoints

## Database Setup

## Testing

- Instructions on how to run tests, including any specific commands or frameworkd used.

## Built with

### Spring MVC Configuration

- WebMvcConfigurer: customize Java-based configuration for Spring MVC enabled via @EnabledWebMvc.

### JWT (Hibrid, not Stateless)

- Authentication: username + password -> backend create AT and RT then save RT to Redis whitelist. After that, return AT in JSON body and RT in HttpOnly Cookie.
- Authorization: Frontend attach AT to request, check AT in blacklist (return 401 logout) then backend decodes, validates and responses.
- Slient Refresh: AT expired => Backend return 401. Frontend doesn't error to client but send /auth/refresh. Backend then checks whitelist, if equal, blacklist AT and create new AT and RT, update whitelist. Client get new AT and reuse request.
- Logout: delete RT whitelist, get current AT and push in blacklist with TTL = remain time of AT.

### RBAC (Role-Based Access Control)

### Dynamic Menu

### CI/CD Tools (Jenkins)

- Link: https://www.youtube.com/playlist?list=PLy7NrYWoggjw_LIiDK1LXdNN82uYuuuiC

### AWS Deployments

- Files: buildspec.yml, appspec.yml and scripts folder.

- Link: https://medium.com/@tams67680/simplifying-aws-deployments-understanding-buildspec-yml-and-appspec-yml-cffbb6d091d4

## Contributing

- Guidelines for how others can contribute, including pull request processes and coding standards.

## License

## Contact/Authors
