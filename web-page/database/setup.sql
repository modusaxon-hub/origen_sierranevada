-- ========================================
-- Configuración de Base de Datos Supabase
-- Origen Sierra Nevada
-- ========================================

-- IMPORTANTE: Ejecuta este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pega este código > Run

-- ========================================
-- 1. TABLA DE PERFILES DE USUARIO
-- ========================================

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Comentarios para documentación
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con información adicional y roles';
COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: user (normal) o admin (administrador)';

-- ========================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índice por email para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Índice por rol para filtros de acceso
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activar RLS en la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: Solo admins pueden ver todos los perfiles
CREATE POLICY "Admins pueden ver todos los perfiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 4. FUNCIÓN: CREAR PERFIL AUTOMÁTICAMENTE
-- ========================================

-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user' -- Por defecto todos son usuarios normales
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario de la función
COMMENT ON FUNCTION public.handle_new_user() IS 'Crea automáticamente un perfil cuando se registra un nuevo usuario';

-- ========================================
-- 5. TRIGGER: EJECUTAR FUNCIÓN AL REGISTRARSE
-- ========================================

-- Eliminar trigger si existe (para poder recrearlo)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 6. FUNCIÓN: ACTUALIZAR updated_at
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. TRIGGER: ACTUALIZAR updated_at AL MODIFICAR
-- ========================================

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- 8. CREAR USUARIO ADMINISTRADOR DE PRUEBA
-- ========================================

-- IMPORTANTE: Este paso debes hacerlo MANUALMENTE en Authentication > Users
-- 1. Ve a Dashboard > Authentication > Users
-- 2. Click en "Add user" > "Create new user"
-- 3. Email: cafemalusm@gmail.com
-- 4. Password: @-@UYpG29kf.K3Y
-- 5. Click "Create user"

-- LUEGO, ejecuta esta query para darle rol de admin:

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'cafemalusm@gmail.com';

-- Verificar que se actualizó correctamente:
SELECT email, role, created_at FROM public.profiles WHERE email = 'cafemalusm@gmail.com';

-- ========================================
-- 9. VERIFICACIÓN
-- ========================================

-- Ejecuta esta query para verificar que todo está correcto:
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Deberías ver al menos un usuario (el admin que creaste)

-- ========================================
-- ✅ SETUP COMPLETO
-- ========================================

-- Si llegaste hasta aquí sin errores, ¡felicidades!
-- Tu base de datos está lista para usar.

-- Próximos pasos:
-- 1. Crea un usuario admin en Authentication > Users
-- 2. Ejecuta el UPDATE para darle rol admin
-- 3. Regresa a tu aplicación y prueba el login
