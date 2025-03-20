# Base image
FROM openjdk:17-jdk-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY . .

RUN ./gradlew clean build -x test

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]


