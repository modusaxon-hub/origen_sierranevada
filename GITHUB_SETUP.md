# 🚀 Instrucciones para Subir a GitHub

## Tu Cuenta de GitHub
- **Usuario**: manuelpertuz624-eng
- **Email**: manuel.pertuz624@gmail.com
- **Perfil**: https://github.com/manuelpertuz624-eng

---

## Paso 1: Crear el Repositorio en GitHub

1. **Abre tu navegador** y ve a: https://github.com/new

2. **Inicia sesión** si no lo estás (con manuel.pertuz624@gmail.com)

3. **Completa el formulario**:
   - **Repository name**: `origen-sierra-nevada`
   - **Description**: `Proyecto web para Café Origen Sierra Nevada - Café premium de la Sierra Nevada de Santa Marta`
   - **Visibility**: 
     - ✅ **Private** (recomendado para proyecto comercial)
     - o **Public** (si quieres que sea de código abierto)
   - ❌ **NO marques** "Add a README file"
   - ❌ **NO marques** "Add .gitignore"
   - ❌ **NO marques** "Choose a license"

4. **Click en "Create repository"**

---

## Paso 2: Conectar tu Proyecto Local

Después de crear el repositorio, GitHub te mostrará una página con instrucciones. 

**Copia y ejecuta estos comandos** en tu terminal de PowerShell:

```powershell
cd "G:\Mi unidad\Diseño Web\origen_sierranevada"

# Añadir el repositorio remoto
git remote add origin https://github.com/manuelpertuz624-eng/origen-sierra-nevada.git

# Renombrar rama a main (recomendado)
git branch -M main

# Subir todo a GitHub
git push -u origin main
```

---

## Paso 3: Autenticación

La primera vez que hagas `git push`, te pedirá autenticación:

### Opción A: GitHub CLI (Recomendado)
Si tienes GitHub CLI instalado:
```powershell
gh auth login
```

### Opción B: Personal Access Token
1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" > "Generate new token (classic)"
3. Dale un nombre: "Origen Sierra Nevada"
4. Marca el scope: **repo** (completo)
5. Click en "Generate token"
6. **Copia el token** (solo se muestra una vez)
7. Cuando git pida contraseña, **pega el token** (no tu contraseña de GitHub)

### Opción C: GitHub Desktop
Si prefieres interfaz gráfica, descarga GitHub Desktop y abre el proyecto ahí.

---

## Paso 4: Verificar

Una vez hecho el push:

1. Ve a: https://github.com/manuelpertuz624-eng/origen-sierra-nevada
2. Deberías ver todos tus archivos
3. El README.md se mostrará en la página principal

---

## 🎯 Comandos Resumidos

```powershell
# 1. Ve a la carpeta del proyecto
cd "G:\Mi unidad\Diseño Web\origen_sierranevada"

# 2. Añade el remote
git remote add origin https://github.com/manuelpertuz624-eng/origen-sierra-nevada.git

# 3. Renombra la rama
git branch -M main

# 4. Push inicial
git push -u origin main
```

---

## ✅ Después del Push

Una vez subido, podrás:
- Ver tu código en: https://github.com/manuelpertuz624-eng/origen-sierra-nevada
- Clonar en otros computadores
- Trabajar con colaboradores
- Ver el historial de cambios
- Crear ramas y pull requests

---

## 🔒 Nota de Seguridad

✅ Tu archivo `.env` con credenciales de Supabase **NO** se subirá a GitHub  
✅ Está protegido por el `.gitignore`  
✅ Es seguro hacer el push

---

## 📝 Siguientes Pasos (después del push)

```powershell
# Para futuros cambios:
git add .
git commit -m "descripción del cambio"
git push
```

---

**¿Listo para crear el repositorio?** Abre https://github.com/new y sigue los pasos arriba. ¡Avísame si tienes algún problema! 🚀
