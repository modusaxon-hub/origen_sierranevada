# 🚀 Guía de Scripts — Origen Sierra Nevada

## 📋 Orden de Ejecución Correcta

### **Primera vez (Setup inicial)**
```
01_instalar_dependencias.bat    ← Instala node_modules (una sola vez)
↓
02_iniciar_desarrollo.bat        ← Inicia dev server para trabajar
```

### **Desarrollo normal (cada día)**
```
02_iniciar_desarrollo.bat        ← Abre servidor local en http://127.0.0.1:5000
(Ctrl+C para detener cuando termines)
```

### **Cuando estés listo para subir cambios**
```
03_validar_proyecto.bat          ← Verifica NO hay errores TypeScript
↓
04_compilar_produccion.bat       ← Genera carpeta /build optimizada
↓
05_copiar_a_htdocs.bat          ← Copia a staging (InfinityFree)
(Pedirá confirmación)
```

### **Si necesitas liberar espacio en disco**
```
06_limpiar_proyecto.bat          ← Elimina node_modules + build
(Después ejecuta 01_instalar_dependencias.bat para restaurar)
```

---

## 🔄 Flujos Típicos

### **Desarrollar localmente**
1. Abre `02_iniciar_desarrollo.bat` (mantén la ventana abierta)
2. Edita código en VS Code
3. Los cambios se ven **en vivo** en http://127.0.0.1:5000
4. Cuando termines, cierra la ventana (Ctrl+C)

### **Subir cambios a staging (htdocs)**
1. Abre `03_validar_proyecto.bat` → Espera a que termine
   - ✅ Si no hay errores rojos → Continúa
   - ❌ Si hay errores → Corrige en VS Code y repite
2. Abre `04_compilar_produccion.bat` → Espera a que termine
3. Abre `05_copiar_a_htdocs.bat` → Confirma con "S"
4. Verifica en https://origen2025.share.zrok.io/ que todo se ve bien

---

## 📊 Estados de cada Script

| Script | Estado | Cuándo usarlo |
|--------|--------|---------------|
| 01_instalar_dependencias | ✅ Primera vez | Al clonar el proyecto |
| 02_iniciar_desarrollo | ✅ Cada sesión | Cuando quieras desarrollar |
| 03_validar_proyecto | ✅ Antes de subir | Para verificar sin errores |
| 04_compilar_produccion | ✅ Después de validar | Genera versión optimizada |
| 05_copiar_a_htdocs | ✅ Antes de ir a producción | Sube a staging |
| 06_limpiar_proyecto | ⚠️ Opcional | Si necesitas espacio en disco |

---

## ⚡ Atajos rápidos

**Para desarrollar ahora:**
```bash
Doble-clic → 02_iniciar_desarrollo.bat
```

**Para subir cambios listos:**
```bash
Ejecutar en orden:
1. 03_validar_proyecto.bat
2. 04_compilar_produccion.bat
3. 05_copiar_a_htdocs.bat
```

---

## 🚨 Notas importantes

- **Puerto fijo:** Siempre `5000` (no cambia)
- **htdocs/:** Solo actualizar después de validar ✅
- **Confirmación obligatoria:** Script 05 pide confirmación antes de copiar
- **node_modules:** ~400 MB. Puedes eliminar con script 06 si necesitas espacio

---

## 🆘 Si algo falla

**Error en 03_validar_proyecto.bat:**
- Revisa errores TypeScript en consola
- Corrige en VS Code
- Ejecuta 03 nuevamente

**Error en 05_copiar_a_htdocs.bat:**
- Verifica que 03 y 04 completaron sin errores
- Comprueba que existe `build/` en `web-page/pages/`
- Intenta nuevamente

**Quiero empezar de cero:**
1. Ejecuta `06_limpiar_proyecto.bat`
2. Ejecuta `01_instalar_dependencias.bat`
3. Ejecuta `02_iniciar_desarrollo.bat`

---

**Última actualización:** 04 Mar 2026
**Próximo:** Ejecuta `02_iniciar_desarrollo.bat` para empezar 🚀
