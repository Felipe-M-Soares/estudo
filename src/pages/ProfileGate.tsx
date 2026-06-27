import { useState } from 'react';
import { Plus, Lock, Trash2, ArrowLeft } from 'lucide-react';
import type { Profile } from '../data/profileTypes';

interface ProfileGateProps {
  profiles: Profile[];
  avatarOptions: string[];
  onCreateProfile: (name: string, pin: string, avatarEmoji?: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToProfile: (profileId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteProfile: (profileId: string) => void;
}

type Mode = 'list' | 'create' | 'enter-pin';

export function ProfileGate({ profiles, avatarOptions, onCreateProfile, onSwitchToProfile, onDeleteProfile }: ProfileGateProps) {
  const [mode, setMode] = useState<Mode>('list');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    setLoading(true);
    const result = await onCreateProfile(name, pin, avatar);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Não foi possível criar o perfil.');
    }
  }

  function selectProfile(profile: Profile) {
    setSelectedProfile(profile);
    setError(null);
    setPin('');
    if (profile.pinHash) {
      setMode('enter-pin');
    } else {
      onSwitchToProfile(profile.id, '');
    }
  }

  async function handleEnterWithPin() {
    if (!selectedProfile) return;
    setError(null);
    setLoading(true);
    const result = await onSwitchToProfile(selectedProfile.id, pin);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'PIN incorreto.');
    }
  }

  function resetToList() {
    setMode('list');
    setSelectedProfile(null);
    setName('');
    setPin('');
    setError(null);
    setConfirmDelete(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="w-full max-w-md animate-rise-in">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint-400 to-mint-500 font-display text-lg font-bold text-base-950 shadow-[0_4px_20px_-4px_theme(colors.mint.400)]">
            {'</>'}
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-base-50">DevJourney</h1>
          <p className="mt-1 text-sm text-base-400">
            {mode === 'list' && 'Quem está estudando?'}
            {mode === 'create' && 'Criar novo perfil'}
            {mode === 'enter-pin' && `Entrar como ${selectedProfile?.name}`}
          </p>
        </div>

        {mode === 'list' && (
          <div className="space-y-2.5">
            {profiles.map((profile) => (
              <div key={profile.id} className="card-surface card-surface-hover flex items-center gap-3 rounded-2xl p-3.5">
                <button onClick={() => selectProfile(profile)} className="flex flex-1 items-center gap-3 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-700 text-xl">
                    {profile.avatarEmoji}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-sm font-semibold text-base-50">{profile.name}</span>
                    {profile.pinHash && (
                      <span className="flex items-center gap-1 text-xs text-base-400">
                        <Lock size={11} /> Protegido por PIN
                      </span>
                    )}
                  </span>
                </button>
                {confirmDelete === profile.id ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => onDeleteProfile(profile.id)}
                      className="rounded-lg bg-ember-500 px-2.5 py-1.5 text-xs font-semibold text-white"
                    >
                      Excluir
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-base-600 px-2 py-1.5 text-xs text-base-300">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(profile.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base-500 hover:bg-ember-500/10 hover:text-ember-400"
                    aria-label="Excluir perfil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => { setMode('create'); setError(null); }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-base-600 p-4 text-sm font-medium text-base-300 transition-colors hover:border-mint-400/40 hover:text-mint-300"
            >
              <Plus size={16} /> Criar novo perfil
            </button>

            {profiles.length === 0 && (
              <p className="text-center text-xs text-base-500">
                Nenhum perfil ainda — crie o seu para começar a estudar.
              </p>
            )}
          </div>
        )}

        {mode === 'create' && (
          <div className="card-surface space-y-4 rounded-2xl p-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-base-300">Escolha um avatar</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-colors ${
                      avatar === emoji ? 'bg-mint-400/20 ring-2 ring-mint-400' : 'bg-base-800 hover:bg-base-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-base-300">Seu nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você quer ser chamado?"
                autoFocus
                className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-base-100 outline-none focus:border-mint-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-base-300">
                PIN <span className="text-base-500">(opcional, 4+ dígitos)</span>
              </label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Deixe vazio para não usar PIN"
                type="password"
                inputMode="numeric"
                className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-base-100 outline-none focus:border-mint-400"
              />
              <p className="mt-1.5 text-[11px] text-base-500">
                Isso só impede que outra pessoa usando este mesmo navegador abra seu perfil por engano — não é uma senha de
                verdade. O progresso fica salvo só neste navegador, em nenhum servidor.
              </p>
            </div>

            {error && <p className="text-sm text-ember-400">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={resetToList} className="flex items-center gap-1.5 rounded-lg border border-base-600 px-4 py-2.5 text-sm text-base-300 hover:bg-base-800">
                <ArrowLeft size={14} /> Voltar
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || name.trim().length < 2}
                className="flex-1 rounded-lg bg-mint-400 px-4 py-2.5 text-sm font-semibold text-base-950 disabled:opacity-40"
              >
                {loading ? 'Criando...' : 'Criar perfil e começar'}
              </button>
            </div>
          </div>
        )}

        {mode === 'enter-pin' && selectedProfile && (
          <div className="card-surface space-y-4 rounded-2xl p-5 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-700 text-2xl">
              {selectedProfile.avatarEmoji}
            </span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleEnterWithPin()}
              placeholder="Digite seu PIN"
              type="password"
              inputMode="numeric"
              autoFocus
              className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-center text-sm text-base-100 outline-none focus:border-mint-400"
            />
            {error && <p className="text-sm text-ember-400">{error}</p>}
            <div className="flex gap-2">
              <button onClick={resetToList} className="flex items-center gap-1.5 rounded-lg border border-base-600 px-4 py-2.5 text-sm text-base-300 hover:bg-base-800">
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={handleEnterWithPin}
                disabled={loading || !pin.trim()}
                className="flex-1 rounded-lg bg-mint-400 px-4 py-2.5 text-sm font-semibold text-base-950 disabled:opacity-40"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-base-500">
          Os perfis ficam salvos só neste navegador — não há sincronização entre dispositivos.
        </p>
      </div>
    </div>
  );
}
