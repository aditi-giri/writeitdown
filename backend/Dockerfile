# ===============================
# BUILD STAGE
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom first (for dependency caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build jar (skip tests)
RUN ./mvnw clean package -DskipTests


# ===============================
# RUN STAGE
# ===============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java","-jar","app.jar"]

