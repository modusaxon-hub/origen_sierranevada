# Integración Supabase - Origen Sierra Nevada

Implementación completa de autenticación con Supabase y protección del brandbook para acceso exclusivo de administradores.

## User Review Required

> [!IMPORTANT]
> **Credenciales de Supabase Incompletas**: Necesito que me proporciones la URL completa de tu proyecto Supabase. El archivo [.env](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/web-page/pages/.env) tiene:
> ```
> NEXT_PUBLIC_SUPABASE_URL=https://
> NEXT_PUBLIC_SUPABASE_ANON_KEY=sbp_d45e7014cc21ba012737927a042f5de08b997001
> ```
> La URL está incompleta. Debería verse algo como:
> ```
> NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
> ```

> [!NOTE]
> **Opciones de Implementación**:
> 1. Si ya tienes un proyecto Supabase, proporciona la URL
> 2. Si no tienes proyecto, te guío para crearlo en supabase.com
> 3. Puedo proceder con configuración genérica que ajustarás después

---

## Proposed Changes

### Configuración y Dependencias

#### [MODIFY] [.env](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/.env)
Completar las credenciales de Supabase con la URL correcta del proyecto.

#### [MODIFY] [package.json](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/package.json)
Añadir dependencias de Supabase:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

---

### Servicios y Configuración

#### [NEW] [supabaseClient.ts](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/services/supabaseClient.ts)
Cliente de Supabase configurado con variables de entorno.

#### [NEW] [authService.ts](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/services/authService.ts)
Servicio de autenticación con funciones para:
- Login con email/password
- Logout
- Obtener sesión actual
- Verificar rol de usuario

---

### Tipos TypeScript

#### [MODIFY] [types.ts](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/types.ts)
Añadir interfaces para:
- `User`: Usuario de Supabase
- `UserRole`: Roles (admin, user)
- `AuthState`: Estado de autenticación
- [Profile](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/web-page/pages/types.ts#16-22): Perfil de usuario con rol

---

### Contextos y Estado

#### [NEW] [AuthContext.tsx](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/contexts/AuthContext.tsx)
Context Provider para:
- Estado de autenticación global
- Usuario actual
- Funciones de login/logout
- Loading states

---

### Componentes de Autenticación

#### [NEW] [Login.tsx](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/pages/Login.tsx)
Página de login con:
- Formulario de email/password
- Validación de campos
- Manejo de errores
- Diseño consistente con brandbook (colores dorados/verde)

#### [NEW] [ProtectedRoute.tsx](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/components/ProtectedRoute.tsx)
Componente HOC para proteger rutas:
- Verifica autenticación
- Verifica rol (opcional)
- Redirige a login si no autorizado

---

### Brandbook React

#### [NEW] [Brandbook.tsx](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/pages/Brandbook.tsx)
Migración del [brandbook.html](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/Documentation/Brandbook%20Origen%20SNSM/brandbook.html) a componente React:
- Mantener todo el diseño y funcionalidad
- Usar Tailwind como ya está configurado
- Integrar con sistema de autenticación  
- Botón de logout en header

---

### Base de Datos Supabase

#### Esquema SQL

```sql
-- Tabla de perfiles de usuario
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Políticas de acceso
create policy "Usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Función para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para ejecutar la función
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

### Routing y Navegación

#### [MODIFY] [App.tsx](file:///G:/Mi%20unidad/Diseño%20Web/origen_sierranevada/web-page/pages/App.tsx)
Actualizar rutas con:
- Ruta pública `/login`
- Ruta protegida `/brandbook` (solo admin)
- AuthProvider envolviendo toda la app
- Redirecciones basadas en autenticación

---

## Verification Plan

### Automated Tests
No aplicable en esta fase inicial.

### Manual Verification

1. **Configuración de Supabase**:
   - Crear proyecto en Supabase Dashboard
   - Copiar credenciales al archivo [.env](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/web-page/pages/.env)
   - Ejecutar script SQL para crear tablas
   - Crear usuario admin de prueba

2. **Testing de Autenticación**:
   - Instalar dependencias: `npm install`
   - Iniciar servidor: `npm run dev`
   - Acceder a `/login`
   - Intentar acceder a `/brandbook` sin login → debe redirigir
   - Hacer login con usuario normal → brandbook debe denegar acceso
   - Hacer login con usuario admin → brandbook debe permitir acceso

3. **Funcionalidad del Brandbook**:
   - Verificar que todas las funcionalidades originales funcionan
   - Probar copiado de colores
   - Verificar animaciones y navegación
   - Probar menú móvil
   - Verificar botón de logout

4. **Seguridad**:
   - Intentar acceder directamente a `/brandbook` sin token
   - Verificar que tokens expiran correctamente
   - Probar logout y re-login

---

## Notas de Implementación

> [!TIP]
> **Migración Gradual**: El brandbook HTML actual seguirá funcionando. La versión React será adicional y podrá coexistir durante el desarrollo.

> [!WARNING]
> **Seguridad de Credenciales**: Asegúrate de añadir [.env](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/web-page/pages/.env) al [.gitignore](file:///G:/Mi%20unidad/Dise%C3%B1o%20Web/origen_sierranevada/web-page/pages/.gitignore) para no subir credenciales al repositorio.
