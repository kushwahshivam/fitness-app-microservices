# Fitness App Microservices — Frontend ↔ Backend Issues Analysis

I've analyzed every file across all 6 services and the frontend. Below are **13 bugs** across 4 severity levels that prevent the frontend from working correctly with the backend.

---

## 🔴 Critical Issues (App-Breaking)

### 1. CORS Not Wired Into Security Filter Chain
**File:** [SecurityConfig.java](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/gateway/src/main/java/com/fitness/gateway/SecurityConfig.java)

The `CorsConfigurationSource` bean is defined but **never referenced** in the `SecurityWebFilterChain`. All cross-origin requests from the frontend (`localhost:5173`) to the gateway (`localhost:8080`) will be **blocked by the browser**.

```diff
 return http
         .csrf(ServerHttpSecurity.CsrfSpec::disable)
+        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
         .authorizeExchange(exchange -> exchange
                 .pathMatchers("/actuator/*").permitAll()
                 .anyExchange().authenticated()
         ).oauth2ResourceServer(oauth2->oauth2.jwt(Customizer.withDefaults()))
         .build();
```

> [!CAUTION]
> This is the **#1 reason** the frontend cannot communicate with the backend. Every API call will fail with a CORS error in the browser console.

---

### 2. Config Server YAML — Broken Indentation
**File:** [application.yml](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/configserver/src/main/resources/application.yml)

The `cloud.config.server` block is nested under `profiles` instead of `spring`. This means the config server **won't serve any config files** to other services.

**Current (broken):**
```yaml
spring:
  profiles:
    active: native
    cloud:           # ← nested under profiles (WRONG)
      config:
        server:
          native:
            search-locations: classpath:/config
```

**Fixed:**
```yaml
spring:
  application:
    name: config-server
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations: classpath:/config

server:
  port: 8888
```

> [!CAUTION]
> Without this fix, gateway routes, database URLs, Eureka endpoints, and OAuth2 configs **will not be loaded** by any service. All services will fail to start properly.

---

### 3. CSS Files Never Imported — Blank/Unstyled Page
**File:** [main.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/main.jsx)

Neither `index.css` nor `App.css` is imported anywhere. The app will render with no styles applied.

```diff
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import './index.css'

 import { Provider } from 'react-redux'
 import { store } from './store/store'

 import App from './App'
+import './App.css'
 import { AuthProvider } from 'react-oauth2-code-pkce'
 import { authConfig } from './authConfig'
```

---

### 4. Prop Name Mismatch — ActivityForm Submit Crashes
**Files:** [App.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/App.jsx#L13) → [ActivityForm.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/components/ActivityForm.jsx#L6)

The parent passes `onActivitiesAdded` (plural) but the child component expects `onActivityAdded` (singular). The form submission will crash with `onActivityAdded is not a function`.

| Location | Prop Name |
|---|---|
| `App.jsx` line 13 | `onActivitiesAdded` |
| `ActivityForm.jsx` line 6 | `onActivityAdded` |

```diff
 // App.jsx - ActivitiesPage component
-<ActivityForm onActivitiesAdded = {() => window.location.reload()} />
+<ActivityForm onActivityAdded = {() => window.location.reload()} />
```

---

## 🟠 High Severity Issues (Features Broken)

### 5. ActivityForm Doesn't Send `userId` — 400/500 Errors on POST
**File:** [ActivityForm.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/components/ActivityForm.jsx#L8-L11)

The backend `ActivityRequest` **requires** `userId`, but the frontend form state doesn't include it. The `trackActivity` service method will throw `RuntimeException("Invalid user id null")`.

```diff
 const [activity, setActivity] = useState({
-    type: "RUNNING", duration: '', caloriesBurned: '',
-    additionalMetrics: {}
+    type: "RUNNING", duration: '', caloriesBurned: '',
+    additionalMetrics: {},
+    userId: localStorage.getItem('userId')
 });
```

---

### 6. RecommendationController Missing Leading Slash
**File:** [RecommendationController.java](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/aiservice/src/main/java/com/fitness/aiservice/controller/RecommendationController.java#L17)

```diff
-@RequestMapping("api/recommendations")
+@RequestMapping("/api/recommendations")
```

Without the leading `/`, the path may not match the gateway route predicate `Path=/api/recommendations/**`, causing **404 errors** when fetching activity details/recommendations.

---

### 7. ActivityDetail — Complete Data Model Mismatch
**File:** [ActivityDetail.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/components/ActivityDetail.jsx)

`getActivityDetail(id)` calls `GET /api/recommendations/activity/${id}` which returns a **`Recommendation`** object. But the component treats it as an Activity. The field names don't match:

| Frontend renders | Recommendation model has | Result |
|---|---|---|
| `activity.type` | `activityType` | `undefined` |
| `activity.duration` | *(not present)* | `undefined` |
| `activity.caloriesBurned` | *(not present)* | `undefined` |
| `activity.createdAt` | `createdAt` | ✅ works |
| `activity.recommendation` | `recommendation` | ✅ works |
| `activity.improvements` | `improvements` | ✅ works |
| `activity.suggestions` | `suggestions` | ✅ works |
| `activity.safety` | `safety` | ✅ works |

The detail page should either fetch the activity first from `/api/activities/{id}` AND then the recommendation, or the backend should return a combined DTO.

---

### 8. ActivityDetail — Renders Array Instead of Item
**File:** [ActivityDetail.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/components/ActivityDetail.jsx#L51)

Line 51 renders `{activity.improvements}` (the entire array) instead of the individual `improvement` from the `.map()` callback:

```diff
 {activity?.improvements?.map((improvement, index) => (
-    <Typography key={index} paragraph>• {activity.improvements}</Typography>
+    <Typography key={index} paragraph>• {improvement}</Typography>
 ))}
```

---

### 9. User Registration Endpoint Path Mismatch
**File:** [UserController.java](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/userservice/src/main/java/com/fitness/userservice/controller/UserController.java#L24)

The gateway calls `/api/users/register` but the controller endpoint is `@PostMapping("/{register}")` — this has `{register}` as a **path variable** (the curly braces make it a URL template), not a literal path segment. While it will technically match, the literal string `"register"` gets bound as a path variable that's never used. It should be:

```diff
-@PostMapping("/{register}")
+@PostMapping("/register")
 public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
```

---

## 🟡 Medium Severity Issues (Subtle Bugs)

### 10. Bitwise OR Instead of Logical OR in Auth Slice
**File:** [authSlice.js](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/store/authSlice.js#L8)

Line 8 uses `|` (bitwise OR) instead of `||` (logical OR). This coerces the localStorage value to a **number**, so `userId` will be `0` instead of `null` when no value exists.

```diff
-userId: localStorage.getItem('userId') | null
+userId: localStorage.getItem('userId') || null
```

---

### 11. Spring Boot Version Mismatch Across Services
The services use **different Spring Boot parent versions**, which can cause classpath conflicts when communicating:

| Service | Spring Boot Version | Spring Cloud Version |
|---|---|---|
| Gateway | `3.4.3` | `2024.0.0` |
| Activity Service | `4.0.4` | `2025.1.1` |
| User Service | `4.0.4` | `2025.1.1` |
| AI Service | `4.0.5` | `2025.1.1` |

> [!WARNING]
> The gateway is on Spring Boot **3.4.3** while other services are on **4.0.x**. This means the gateway uses Spring Cloud `2024.0.0` while others use `2025.1.1`. Potential serialization and protocol incompatibilities may arise.

---

### 12. AI Service: Java Version Mismatch in Maven Compiler
**File:** [pom.xml](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/aiservice/pom.xml#L102-L103)

The AI service `pom.xml` declares `<java.version>21</java.version>` in properties but the maven-compiler-plugin is configured with `<source>15</source>` and `<target>15</target>`. These conflict.

```diff
 <configuration>
-    <source>15</source>
-    <target>15</target>
+    <source>21</source>
+    <target>21</target>
 </configuration>
```

---

## 🔵 Low Severity Issues (Code Quality)

### 13. `react-router` v7 Import Pattern
**File:** [App.jsx](file:///d:/Spring%20Boot%20Projects/fitness-app-microservices/fitness-app-frontend/src/App.jsx#L5)

Using `react-router` v7 (`"react-router": "^7.2.0"` in package.json) but importing `BrowserRouter` from `react-router`. In v7, the router components are exported from `react-router` directly (unlike v6 where they were in `react-router-dom`). This should work, but verify `BrowserRouter` is available in the specific v7 build you're using, or import from `react-router-dom` if installed.

---

## Summary — Fix Priority Order

| # | Issue | Impact | Where |
|---|---|---|---|
| 1 | CORS not wired | **All API calls fail** | Gateway SecurityConfig |
| 2 | Config Server YAML broken | **No service configs load** | Config Server |
| 3 | CSS not imported | **Unstyled page** | Frontend main.jsx |
| 4 | Prop name mismatch | **Form submit crashes** | Frontend App.jsx |
| 5 | Missing userId in form | **Activity create fails** | Frontend ActivityForm |
| 6 | Missing leading `/` | **Recommendations 404** | AI RecommendationController |
| 7 | Data model mismatch | **Detail page shows undefined** | Frontend ActivityDetail |
| 8 | Array render bug | **Shows [object Object]** | Frontend ActivityDetail |
| 9 | Register endpoint path | **User sync may break** | User Controller |
| 10 | Bitwise OR bug | **userId stored as 0** | Frontend authSlice |
| 11 | Spring Boot version mismatch | **Potential incompatibility** | All backend pom.xml |
| 12 | Java version mismatch | **Compile warnings** | AI Service pom.xml |
| 13 | react-router import | **Potential import issue** | Frontend App.jsx |

> [!IMPORTANT]
> **Issues #1 and #2 are the root causes** of the frontend not working with the backend. Fix those first, then address #3-#10 to get the app fully functional.
