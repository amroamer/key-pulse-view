import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { listModels, type ModelInfo } from "@/lib/chatClient";
import { getSelectedModel, setSelectedModel } from "@/lib/modelSettings";

const formatSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
};

const formatModified = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const Settings = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [defaultModel, setDefaultModel] = useState<string>("");
  const [override, setOverride] = useState<string | null>(getSelectedModel());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listModels();
      setModels(result.models);
      setDefaultModel(result.default);
      if (result.error) setError(result.error);
    } catch (e) {
      setError((e as Error).message);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const apply = (model: string | null) => {
    setOverride(model);
    setSelectedModel(model);
    toast({
      title: model ? "Model selected" : "Reverted to default",
      description: model
        ? `Chat will now use ${model}.`
        : `Chat will use the server default (${defaultModel}).`,
    });
  };

  const activeModel = override ?? defaultModel;
  const overrideActive = override !== null && override !== defaultModel;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top nav */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <RefreshCw size={12} className="mr-1.5" /> Refresh
              </>
            )}
          </Button>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick which language model the chat assistant uses. The list below
            comes from the Ollama server you're connected to — only models that
            are actually installed there will work.
          </p>
        </div>

        {/* Currently using */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
          <div className="rounded-lg bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] p-2 shrink-0">
            <Cpu size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Currently using
            </div>
            <div className="mt-0.5 font-mono text-base font-semibold text-foreground break-all">
              {activeModel || "—"}
            </div>
            {overrideActive && (
              <div className="mt-1 text-xs text-muted-foreground">
                Server default: <span className="font-mono">{defaultModel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Models list */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Available models on this server
          </h2>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-medium">Couldn't reach the model server</div>
                <div className="text-xs mt-0.5 font-mono break-all">{error}</div>
                <div className="text-xs mt-2 text-destructive/80">
                  Check that the Ollama container is running:{" "}
                  <code className="bg-background px-1 py-0.5 rounded">npm run stack:up</code>.
                </div>
              </div>
            </div>
          )}

          {!error && !loading && models.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              No models installed on the server. Pull one with{" "}
              <code className="bg-background px-1 py-0.5 rounded text-xs">
                ollama pull qwen2.5:7b
              </code>{" "}
              and refresh.
            </div>
          )}

          {!error && models.length > 0 && (
            <div className="space-y-2">
              {models.map((m) => {
                const isActive = m.name === activeModel;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => apply(m.name)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors flex items-center gap-3 ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40 hover:bg-primary/[0.02]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-sm font-medium text-foreground break-all">
                        {m.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                        {m.size && <span>{formatSize(m.size)}</span>}
                        {m.modified_at && <span>· Updated {formatModified(m.modified_at)}</span>}
                        {m.name === defaultModel && (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <CheckCircle2 size={18} className="text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Revert */}
        {overrideActive && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => apply(null)}>
              Revert to server default ({defaultModel})
            </Button>
          </div>
        )}

        {/* Help */}
        <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
          <p>
            Selection is stored in your browser only — refresh the page or open
            another browser and you'll see this list again.
          </p>
          <p>
            Bigger models (e.g. <code>qwen2.5:14b</code>) follow instructions
            more reliably than 7B but need more memory on the server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
