# Usamos una imagen base de OpenJDK 17
FROM openjdk:17

# Establecemos el directorio de trabajo en /app
WORKDIR /app

# Copiamos el archivo JAR de la aplicación Spring Boot a /app
COPY target/*.jar app.jar

# Exponemos el puerto en el que se ejecutará la aplicación (ajusta el puerto según la configuración de tu aplicación)
EXPOSE 8080

# Comando para ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "app.jar"]
