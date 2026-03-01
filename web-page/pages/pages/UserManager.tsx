import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { emailService } from '../services/emailService';

import { UserRole, SecurityFlag, UserStatus } from '../types';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    status: UserStatus;
    security_flag?: SecurityFlag;
    security_notes?: string;
    created_at: string;
}

const UserManager: React.FC = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: string; currentRole: UserRole; fullName: string } | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('user');
    const [banModal, setBanModal] = useState<{ isOpen: boolean; userId: string; fullName: string } | null>(null);
    const [softDeleteModal, setSoftDeleteModal] = useState<{ isOpen: boolean; userId: string; fullName: string } | null>(null);
    const [securityFlag, setSecurityFlag] = useState<SecurityFlag>('n/a');
    const [securityNotes, setSecurityNotes] = useState('');
    const [showHidden, setShowHidden] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await authService.getAllProfiles();
        if (error) {
            console.error("Error fetching users:", error);
            setError("No se pudieron cargar los usuarios. Verifica tus permisos.");
        } else {
            setProfiles(data as Profile[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = (userId: string, currentRole: UserRole, fullName: string) => {
        setConfirmModal({
            isOpen: true,
            userId,
            currentRole,
            fullName
        });
        setSelectedRole(currentRole);
    };

    const confirmRoleChange = async () => {
        if (!confirmModal) return;

        const { userId } = confirmModal;
        const newRole = selectedRole;
        setConfirmModal(null); // Close modal

        const { error } = await authService.updateUserRole(userId, newRole);

        if (error) {
            setError("Error al actualizar rol: " + error.message);
        } else {
            // Optimistic update
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
        }
    };

    const handleBanUser = async () => {
        if (!banModal) return;
        const { userId } = banModal;

        const { error } = await authService.banUser(userId, securityFlag, securityNotes);
        if (error) {
            setError("Error al aplicar restricción: " + error.message);
        } else {
            setBanModal(null);
            setSecurityNotes('');
            setSecurityFlag('n/a');
            fetchUsers(); // Refresh to see changes
        }
    };

    const handleActivateUser = async (userId: string) => {
        const userProfile = profiles.find(p => p.id === userId);

        const { error } = await authService.activateUser(userId);
        if (error) {
            setError("Error al reactivar usuario: " + error.message);
        } else {
            // If user was pending, send the EPIC approval email
            if (userProfile && userProfile.status === 'pending') {
                emailService.sendApprovalEmail(userProfile.email, userProfile.full_name)
                    .catch(e => console.error("Error sending approval email:", e));
            }
            fetchUsers();
        }
    };

    const handleSoftDelete = async () => {
        if (!softDeleteModal) return;
        const { userId } = softDeleteModal;

        const { error } = await authService.banUser(userId, 'eliminacion', 'Eliminado manualmente del panel principal.');
        if (error) {
            setError("Error al eliminar: " + error.message);
        } else {
            setSoftDeleteModal(null);
            fetchUsers();
        }
    };

    const filteredProfiles = profiles.filter(p => {
        if (showHidden) return true;
        return p.status !== 'deleted' && p.status !== 'banned';
    });

    return (
        <div className="min-h-screen bg-[#0B120D] text-white font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#0B120D]/90 backdrop-blur-md border-b border-[#C5A065]/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/admin')}>
                        <span className="material-icons-outlined text-[#C5A065]">arrow_back</span>
                        <h1 className="text-[#C5A065] text-xl font-serif tracking-wide">Gestión de Usuarios</h1>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-serif text-white">Directorio de Personal</h2>
                        <p className="text-white/40 text-xs">Administra accesos, roles y registros de seguridad.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowHidden(!showHidden)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider ${showHidden
                                ? 'bg-[#C5A065]/20 border-[#C5A065] text-[#C5A065]'
                                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                        >
                            <span className="material-icons-outlined text-sm">{showHidden ? 'visibility' : 'visibility_off'}</span>
                            {showHidden ? 'Mostrando Todo' : 'Ver Archivos'}
                        </button>
                        <button
                            onClick={fetchUsers}
                            className="p-2 rounded-full hover:bg-white/5 transition-colors"
                            title="Recargar lista"
                        >
                            <span className="material-icons-outlined text-[#C5A065]">refresh</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    {loading ? (
                        <div className="p-12 text-center text-white/40">Cargando directorio...</div>
                    ) : (filteredProfiles.length === 0) ? (
                        <div className="p-12 text-center text-white/40">
                            {showHidden ? 'No hay registros en la base de datos.' : 'No hay usuarios activos. Revisa los archivos.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Pendientes Table Section (Conditional) */}
                            {filteredProfiles.some(p => p.status === 'pending') && (
                                <div className="border-b-4 border-[#C5A065]/20">
                                    <div className="bg-[#C5A065]/5 p-4 flex items-center gap-3">
                                        <span className="material-icons-outlined text-[#C5A065]">pending_actions</span>
                                        <h3 className="text-[#C5A065] text-xs font-bold uppercase tracking-[0.2em]">Prioridad: Solicitudes por Autorizar</h3>
                                    </div>
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="bg-[#C5A065]/5 divide-y divide-[#C5A065]/10">
                                            {filteredProfiles.filter(p => p.status === 'pending').map((profile) => (
                                                <tr key={profile.id} className="hover:bg-[#C5A065]/10 transition-colors">
                                                    <td className="p-6">
                                                        <div className="font-bold text-white mb-1">{profile.full_name || 'Nuevo Miembro'}</div>
                                                        <div className="text-[#C5A065] text-xs">{profile.email}</div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="px-3 py-1 rounded-full bg-[#C5A065] text-black text-[10px] font-bold tracking-wider uppercase">
                                                            ⏳ ESPERANDO RITUAL
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-white/40 text-xs">
                                                        Solicitado: {new Date(profile.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleActivateUser(profile.id); }}
                                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-[#C5A065] text-black hover:bg-[#D4B075] shadow-lg shadow-[#C5A065]/20 animate-bounce-slow"
                                                        >
                                                            <span className="material-icons-outlined text-sm">how_to_reg</span>
                                                            Conceder Acceso
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="h-4 bg-black/40"></div>
                                </div>
                            )}

                            {/* Main Directory Table */}
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-widest text-[#C5A065]">
                                        <th className="p-6 font-bold">Directorio General</th>
                                        <th className="p-6 font-bold">Rol</th>
                                        <th className="p-6 font-bold">Ingreso</th>
                                        <th className="p-6 font-bold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
                                    {filteredProfiles.filter(p => p.status !== 'pending').map((profile) => (
                                        <tr key={profile.id} className={`hover:bg-white/5 transition-colors ${profile.status === 'deleted' || profile.status === 'banned' ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="font-bold text-white mb-1 flex items-center gap-2">
                                                            {profile.full_name || 'Sin Nombre'}
                                                            {profile.security_notes && (
                                                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[9px]" title="Tiene antecedentes de seguridad">
                                                                    <span className="material-icons-outlined text-[10px]">history</span>
                                                                    ALERTA
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-white/40 text-xs">{profile.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${profile.role === 'admin'
                                                        ? 'bg-[#C5A065]/20 text-[#C5A065] border border-[#C5A065]/30'
                                                        : profile.role === 'colaborador'
                                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                            : 'bg-white/10 text-white/60'
                                                        }`}>
                                                        {profile.role}
                                                    </span>
                                                    {profile.status === 'banned' && (
                                                        <span className="w-fit px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-bold uppercase border border-red-500/30">
                                                            ⚠️ {profile.security_flag || 'Baneado'}
                                                        </span>
                                                    )}
                                                    {profile.status === 'pending' && (
                                                        <span className="w-fit px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 text-[9px] font-bold uppercase border border-blue-500/30">
                                                            ⏳ Pendiente Aprobar
                                                        </span>
                                                    )}
                                                    {profile.status === 'deleted' && (
                                                        <span className="w-fit px-2 py-0.5 rounded bg-zinc-500/20 text-zinc-500 text-[9px] font-bold uppercase border border-zinc-500/30">
                                                            🗑️ Eliminado
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 text-white/40">
                                                {new Date(profile.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {profile.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleActivateUser(profile.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20"
                                                        >
                                                            <span className="material-icons-outlined text-sm">how_to_reg</span>
                                                            Aprobar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRoleChange(profile.id, profile.role, profile.full_name)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-white/5 text-white hover:bg-[#C5A065] hover:text-black border border-white/10"
                                                    >
                                                        <span className="material-icons-outlined text-sm">manage_accounts</span>
                                                        Gestionar
                                                    </button>
                                                    {profile.status === 'banned' || profile.status === 'deleted' ? (
                                                        <button
                                                            onClick={() => handleActivateUser(profile.id)}
                                                            className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20 transition-all"
                                                            title="Reactivar Usuario"
                                                        >
                                                            <span className="material-icons-outlined text-sm">lock_open</span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => setBanModal({ isOpen: true, userId: profile.id, fullName: profile.full_name })}
                                                                className="p-2 rounded-lg text-orange-400 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 transition-all"
                                                                title="Bloquear (Seguridad)"
                                                            >
                                                                <span className="material-icons-outlined text-sm">gavel</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setSoftDeleteModal({ isOpen: true, userId: profile.id, fullName: profile.full_name })}
                                                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                                                title="Eliminar de la lista"
                                                            >
                                                                <span className="material-icons-outlined text-sm">delete_outline</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Elegant Confirmation Modal */}
            {confirmModal?.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                        onClick={() => setConfirmModal(null)}
                    />
                    <div className="relative bg-[#0F1611] border border-[#C5A065]/30 rounded-2xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-up">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-[#C5A065]/10 rounded-full flex items-center justify-center mx-auto border border-[#C5A065]/20">
                                <span className="material-icons-outlined text-[#C5A065] text-3xl">admin_panel_settings</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-serif text-white">Gestionar Rol de Usuario</h3>
                                <p className="text-gray-400 text-sm"> Administrando a <span className="text-white font-bold">{confirmModal.fullName}</span></p>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    {[
                                        { id: 'user', label: 'Usuario (Cliente)', desc: 'Acceso estándar a tienda y pedidos.', icon: 'person' },
                                        { id: 'colaborador', label: 'Colaborador', desc: 'Personal operativo (Almacén, Recepción).', icon: 'engineering' },
                                        { id: 'admin', label: 'Administrador', desc: 'Control total de la plataforma.', icon: 'security' }
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setSelectedRole(r.id as UserRole)}
                                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${selectedRole === r.id
                                                ? 'bg-[#C5A065]/20 border-[#C5A065] ring-1 ring-[#C5A065]'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`material-icons-outlined mt-1 ${selectedRole === r.id ? 'text-[#C5A065]' : 'text-gray-500'}`}>
                                                {r.icon}
                                            </span>
                                            <div>
                                                <p className={`font-bold text-sm ${selectedRole === r.id ? 'text-[#C5A065]' : 'text-white'}`}>{r.label}</p>
                                                <p className="text-[11px] text-gray-400">{r.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmRoleChange}
                                    className="flex-1 px-6 py-3 rounded-xl bg-[#C5A065] text-black hover:bg-[#D4B075] transform active:scale-95 transition-all text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#C5A065]/20"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Security Report / Ban Modal */}
            {banModal?.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setBanModal(null)} />
                    <div className="relative bg-[#0F1611] border border-red-500/40 rounded-3xl w-full max-w-lg p-10 shadow-[0_0_100px_rgba(220,38,38,0.15)] animate-scale-up">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                                    <span className="material-icons-outlined text-red-500 text-3xl">security</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-white">Reporte de Cumplimiento</h3>
                                    <p className="text-gray-400 text-sm italic">Investigando a: <span className="text-white font-bold">{banModal.fullName}</span></p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-red-500/80 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Tipo de Infracción</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'fraude', label: 'Posible Fraude', icon: 'payments' },
                                            { id: 'estafa', label: 'Intento de Estafa', icon: 'report_problem' },
                                            { id: 'extorsion', label: 'Extorsión', icon: 'warning' },
                                            { id: 'uso_indebido', label: 'Uso Indebido', icon: 'block' },
                                            { id: 'prueba', label: 'Usuario de Prueba', icon: 'science' },
                                            { id: 'inactividad', label: 'Inactividad (+1 año)', icon: 'history' },
                                            { id: 'eliminacion', label: 'Eliminación (Soft Delete)', icon: 'delete_forever' }
                                        ].map((flag) => (
                                            <button
                                                key={flag.id}
                                                onClick={() => setSecurityFlag(flag.id as SecurityFlag)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${securityFlag === flag.id
                                                    ? 'bg-red-500/10 border-red-500 ring-1 ring-red-500'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <span className={`material-icons-outlined text-lg ${securityFlag === flag.id ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {flag.icon}
                                                </span>
                                                <span className={`text-xs font-bold ${securityFlag === flag.id ? 'text-white' : 'text-gray-400'}`}>
                                                    {flag.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-red-500/80 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Evidencia / Notas Internas</label>
                                    <textarea
                                        value={securityNotes}
                                        onChange={(e) => setSecurityNotes(e.target.value)}
                                        placeholder="Describe el comportamiento sospechoso o la razón del bloqueo..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-red-500 focus:outline-none h-32 resize-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setBanModal(null)}
                                    className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleBanUser}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 transform active:scale-95 transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-900/40"
                                >
                                    Confirmar Bloqueo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Soft Delete Modal */}
            {softDeleteModal?.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSoftDeleteModal(null)} />
                    <div className="relative bg-[#0F1611] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-scale-up">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                <span className="material-icons-outlined text-white/40 text-3xl">delete_sweep</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-serif text-white">¿Eliminar del Directorio?</h3>
                                <p className="text-gray-400 text-sm">
                                    El usuario <span className="text-white font-bold">{softDeleteModal.fullName}</span> dejará de ser visible en el panel. Podrás restaurarlo desde los archivos en cualquier momento.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setSoftDeleteModal(null)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-xs font-bold uppercase">
                                    Cancelar
                                </button>
                                <button onClick={handleSoftDelete} className="flex-1 px-4 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-all text-xs font-bold uppercase shadow-lg">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
