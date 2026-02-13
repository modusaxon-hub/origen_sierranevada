# ✅ Integración Supabase - Próximos Pasos

## 🎯 Credenciales del Administrador

**Usuario Administrador Principal**:
- **Email**: `cafemalusm@gmail.com`
- **Password**: `@-@UYpG29kf.K3Y`

---

## 📋 Pasos para Completar la Configuración

### 1. Instalar Dependencias

```bash
cd "G:\Mi unidad\Diseño Web\origen_sierranevada\web-page\pages"
npm install
```

> **Nota**: Si `npm install` falla por permisos en Google Drive:
> 1. Copia la carpeta a `C:\temp\`
> 2. Ejecuta `npm install` ahí
> 3. Copia `node_modules` de vuelta

---

### 2. Configurar Base de Datos en Supabase

1. Ve a https://supabase.com/dashboard/project/mffdhoehjuoyxmcufmxc/sql/new
2. Abre el archivo [`setup.sql`](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/database/setup.sql)
3. Copia TODO el contenido
4. Pega en el SQL Editor de Supabase
5. Click en **Run** (botón verde)
6. Deberías ver "Success. No rows returned"

---

### 3. Crear Usuario Administrador

1. En el dashboard: **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Ingresa las credenciales:
   - **Email**: `cafemalusm@gmail.com`
   - **Password**: `@-@UYpG29kf.K3Y`
4. Click **Create user**

5. Vuelve al **SQL Editor** y ejecuta:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'cafemalusm@gmail.com';
```

6. Verifica con:
```sql
SELECT email, role, created_at 
FROM public.profiles 
WHERE email = 'cafemalusm@gmail.com';
```

Deberías ver el usuario con `role = 'admin'`.

---

### 4. Probar Login

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre http://localhost:3000/login

3. Inicia sesión con:
   - **Email**: `cafemalusm@gmail.com`
   - **Password**: `@-@UYpG29kf.K3Y`

4. Si todo funciona, serás autenticado y redirigido

---

## ✅ Verificación

Puedes verificar que todo funciona correctamente:

1. **En Supabase Dashboard**:
   - Authentication > Users: Debe aparecer `cafemalusm@gmail.com`
   - Table Editor > profiles: Debe tener `role = 'admin'`

2. **En la App**:
   - Login debe funcionar sin errores
   - La consola debe mostrar: `✅ Supabase: Cliente inicializado correctamente`

---

## 🔐 Seguridad

> [!WARNING]
> **¡IMPORTANTE!** Estas credenciales son sensibles:
> - No las compartas públicamente
> - No las subas a GitHub
> - El archivo `.env` ya está en `.gitignore`
> - Considera cambiar la contraseña después de la configuración inicial

---

## 🚀 Siguiente Fase

Una vez completados estos pasos, el siguiente objetivo será:
- Migrar el brandbook HTML a componente React
- Proteger la ruta con `<ProtectedRoute requireAdmin={true}>`
- Añadir funcionalidad de logout

¿Quieres que proceda con la migración del brandbook?
