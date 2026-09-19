import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Field of Possibility" }] }),
  component: AdminLayout,
});

type AuthState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "user"; email: string; userId: string; isAdmin: boolean };

function AdminLayout() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const check = async (userId?: string, email?: string) => {
      if (!userId) {
        if (active) setAuth({ status: "anon" });
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (active)
        setAuth({
          status: "user",
          email: email ?? "",
          userId,
          isAdmin: !error && !!data,
        });
    };

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user.id, data.session?.user.email ?? "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user.id, session?.user.email ?? "");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (auth.status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
        Authenticating…
      </div>
    );
  }

  if (auth.status === "anon") {
    return <SignIn onSignedIn={() => router.invalidate()} />;
  }

  if (!auth.isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-accent">Access denied</div>
          <h1 className="font-display text-3xl italic">This account is not an editor.</h1>
          <p className="text-sm text-ink-soft">
            Ask an existing admin to grant the <code>admin</code> role to <strong>{auth.email}</strong> in the <code>user_roles</code> table.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-[11px] font-mono uppercase tracking-widest border border-ink px-4 py-2 hover:bg-ink hover:text-paper"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/admin" className="font-display text-xl italic shrink-0">CMS</Link>
            <nav className="flex gap-5 text-[10px] font-mono uppercase tracking-widest text-ink-soft">
              <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-accent" }} className="hover:text-accent">Posts</Link>
              <Link to="/" className="hover:text-accent">View site →</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-ink-mute">
            <span className="hidden sm:inline">{auth.email}</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}
              className="uppercase tracking-widest border border-rule px-3 py-1.5 hover:bg-ink hover:text-paper"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSignedIn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-paper">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">[ CMS · {mode === "signin" ? "Sign in" : "Create account"} ]</div>
          <h1 className="font-display text-3xl italic">Editor access</h1>
        </div>
        {err && <p className="text-[12px] font-mono text-red-700">{err}</p>}
        <label className="block">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-1">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-rule bg-transparent px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-1">Password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-rule bg-transparent px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
        </label>
        <button disabled={busy} type="submit" className="w-full bg-ink text-paper text-[11px] font-mono uppercase tracking-widest py-2.5 hover:bg-accent transition-colors disabled:opacity-50">
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-[10px] font-mono uppercase tracking-widest text-ink-mute hover:text-accent">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <p className="text-[10px] font-mono text-ink-mute leading-relaxed">
          After signing up, an existing admin must grant your account the <code>admin</code> role in Supabase before you can edit content.
        </p>
      </form>
    </div>
  );
}
