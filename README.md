# Apokalist

A modern task management application built with Spring Boot and vanilla JavaScript, designed to help users organize tasks efficiently with an intuitive interface, real-time countdown timers, and flexible sorting capabilities.

![изображение](https://github.com/user-attachments/assets/6002140b-48c0-4ad5-b246-a093ce73f740)

---
## Features
- **Task Management**: Create, edit, delete, and mark tasks as complete.
- **Smart Sorting**: Sort tasks by due date or creation order (ascending/descending).
- **Real-Time Countdown**: Displays time remaining until task deadlines.
- **Due Date Indicators**: Visual indicators for overdue, due today, and upcoming tasks.
- **Minimalist Interface**: Clean design optimized for productivity.
- **Responsive Design**: Seamless functionality across desktop and mobile devices.

## Design & Color Palette

Apokalist employs a clear and focused design system:

### Color Scheme
- **Primary Background**: White and light gray for optimal readability.
- **Accent Colors**:
  - Success Green (`#28a745`) for completed tasks and buttons.
  - Warning Amber (`#ffc107`) for tasks due today.
  - Danger Red (`#dc3545`) for overdue tasks and delete actions.
- **Text Hierarchy**:
  - Primary text: Dark gray (`#333`) for high contrast.
  - Secondary text: Medium gray (`#666`) for supporting details.
  - Muted text: Light gray (`#999`) for subtle elements.

### Typography
- Utilizes modern, system-prioritized fonts.
- Clear hierarchy with distinct sizes for headers, body text, and captions.
- Balanced line spacing for readability.

### Layout Principles
- **Card-Based Design**: Tasks displayed in clean, organized cards.
- **Generous Whitespace**: Prevents visual clutter.
- **Consistent Spacing**: Uniform margins and padding.
- **Intuitive Actions**: Logical button placement.
- **Visual Feedback**: Subtle hover states and transitions.

## Quick Start

### Prerequisites
- Java 17 or higher.
- Maven 3.6 or higher.
- Modern web browser.

### Installation & Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sou1ence/RabbitSimpleChat.git
   cd apokalist
   ```
2. **Build the Application**:
   ```bash
   mvn clean install
   ```
3. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```
   Or:
   ```bash
   java -jar target/apokalist-0.0.1-SNAPSHOT.jar
   ```
4. **Access the Application**:
   - Backend API: `http://localhost:8081`
   - Frontend: Open `index.html` in a browser or serve via a local server.

### Development Setup
For live reload:
```bash
# Terminal 1 - Run backend
mvn spring-boot:run

# Terminal 2 - Serve frontend
npx http-server . -p 3000
```

## API Endpoints

| Method | Endpoint            | Description                                    |
|--------|---------------------|------------------------------------------------|
| `GET`  | `/data`             | Fetch tasks with optional sorting (`?sortBy=date-asc|date-desc|added-asc|added-desc`) |
| `POST` | `/data`             | Create a new task                              |
| `PUT`  | `/data/{id}`        | Update an existing task                        |
| `PATCH`| `/data/{id}`        | Update task completion status                  |
| `DELETE` | `/data/{id}`      | Delete a task                                  |

### Example Request Bodies
**Create Task:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "dueDate": "2024-12-31",
  "completed": false
}
```

**Update Completion Status:**
```json
{
  "completed": true
}
```

## Architecture

### Backend (Spring Boot)
- **Controller Layer**: RESTful API endpoints (`TaskController`).
- **Model Layer**: JPA entities with validation (`Task`).
- **Repository Layer**: Spring Data JPA repository (`TaskRepository`).
- **Database**: H2 in-memory database (development); configurable for production.

### Frontend (Vanilla JavaScript)
- **ES6+ Features**: Async/await, arrow functions, template literals.
- **Modular Structure**: Separates API calls, DOM manipulation, and event handling.
- **Real-Time Updates**: Live countdown and automatic UI refreshes.
- **Responsive Design**: Utilizes CSS Grid and Flexbox.

## Configuration

### Database Configuration
Default: SqlLite database. For alternative databases, update `application.properties`:
```properties
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/apokalist
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/apokalist
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### CORS Configuration
CORS allows all origins for development. For production, modify `corsConfigurer()` in `ApokalistApplication.java`:
```java
registry.addMapping("/**")
    .allowedOrigins("https://yourdomain.com")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
    .allowedHeaders("*");
```

## Testing
Run tests:
```bash
mvn test
```

## Deployment

### Production Build
```bash
mvn clean package -Pprod
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/apokalist-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request.

## License
Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Spring Boot team for the robust framework.
- Contributors and testers for their valuable input.

---

*Developed by Era*
