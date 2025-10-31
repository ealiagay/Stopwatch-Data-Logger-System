# ⏱️ Cronómetro de Fila Simple

Esta es una aplicación web sencilla, diseñada para **cronometrar y registrar los tiempos de atención de clientes en una fila** (ej. en un banco o ventanilla).

La herramienta está optimizada para la **recolección de datos de Teoría de Colas**.

## ✨ Funcionalidad Básica

* **Registro por Click:** Marca automáticamente la hora del sistema (HH:MM:SS) para cada evento: **Llegada**, **Inicio de Servicio**, y **Fin de Servicio**.

* **Acciones Masivas:** Permite marcar tiempos a varios clientes simultáneamente.
* **Cálculos Automáticos:** Muestra el **Tiempo de Espera**, el **Tiempo de Atención** y el **Tiempo Total** en minutos.
* **Exportación:** Genera un archivo **CSV** para su análisis posterior en Excel o para la importación en software de simulación como **PROMODEL**.

## 📊 Propósito de los Datos

Los datos exportados permiten calcular las métricas clave para el análisis de colas:

1.  **Tasa de Llegada ($\lambda$)**: ¿Con qué frecuencia llegan los clientes?
2.  **Tasa de Servicio ($\mu$)**: ¿Qué tan rápido atiende el cajero?
3.  **Utilización ($\rho$)**: ¿Qué porcentaje del tiempo está ocupado cada cajero? (Clave para determinar "cuál trabaja más").

## 💻 Uso

1.  **Agregar Cliente:** Ingresa el nombre y el ID del Servidor (C1, C2, etc.).
2.  **Marcar Tiempos:** Usa los botones de **Llegada**, **Inicio**, y **Fin** para cada cliente.
3.  **Exportar:** Descarga el CSV con los tiempos y cálculos ya hechos.

---