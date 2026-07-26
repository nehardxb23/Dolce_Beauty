import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetAiMatch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";

export default function AiMatch() {
  const [skinTone, setSkinTone] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("Everyday");
  
  const aiMatchMutation = useGetAiMatch();

  const handleMatch = () => {
    if (!skinTone) return;
    
    aiMatchMutation.mutate({
      data: { skinTone, occasion }
    });
  };

  const occasions = ["Everyday", "Date Night", "Party", "Work", "Wedding"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4">Find Your Perfect Look</h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Get AI-Powered Recommendations Just for You!
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-secondary p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                    Select your base skin tone
                  </h3>
                  <Select value={skinTone} onValueChange={setSkinTone}>
                    <SelectTrigger className="w-full h-16 bg-secondary/20 border-secondary focus:border-primary rounded-xl text-lg px-6">
                      <SelectValue placeholder="Choose Skin Tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Tan">Tan</SelectItem>
                      <SelectItem value="Deep">Deep</SelectItem>
                      <SelectItem value="Rich">Rich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                    What's the occasion?
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {occasions.map(occ => (
                      <Button
                        key={occ}
                        type="button"
                        variant={occasion === occ ? "default" : "outline"}
                        onClick={() => setOccasion(occ)}
                        className={`rounded-full px-6 py-6 text-base ${occasion === occ ? 'bg-primary shadow-md' : 'bg-transparent border-secondary hover:border-primary/50'}`}
                      >
                        {occ}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleMatch}
                    disabled={!skinTone || aiMatchMutation.isPending}
                    className="w-full h-16 text-lg rounded-full shadow-lg shadow-primary/20 group"
                  >
                    {aiMatchMutation.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <>Get My Match <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-3xl p-8 flex items-center justify-center border border-secondary min-h-[300px]">
                {!aiMatchMutation.data && !aiMatchMutation.isPending && (
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Complete the form to see your AI-generated look</p>
                  </div>
                )}
                
                {aiMatchMutation.isPending && (
                  <div className="text-center text-primary">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                    <p className="font-bold animate-pulse">Mixing your perfect shades...</p>
                  </div>
                )}

                {aiMatchMutation.data && (
                  <div className="w-full text-center animate-in zoom-in duration-500">
                    <div className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                      100% Match Found
                    </div>
                    <h3 className="font-serif text-3xl font-bold mb-8">The {occasion} {skinTone} Glam</h3>
                    
                    <div className="space-y-4 text-left">
                      <div className="bg-white p-4 rounded-xl border border-secondary shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
                        <div>
                          <p className="font-bold">Base</p>
                          <p className="text-sm text-muted-foreground">{skinTone} Perfecting Tint</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-secondary shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">2</div>
                        <div>
                          <p className="font-bold">Pop of Color</p>
                          <p className="text-sm text-muted-foreground">{occasion === 'Party' ? 'Bold Berry' : 'Soft Peach'} Blush</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-secondary shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">3</div>
                        <div>
                          <p className="font-bold">Finish</p>
                          <p className="text-sm text-muted-foreground">{occasion === 'Date Night' ? 'Classic Red' : 'Nude Glow'} Lip</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {aiMatchMutation.data && aiMatchMutation.data.length > 0 && (
            <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl font-bold">Recommended Products</h2>
                <p className="text-muted-foreground">Add these to cart to achieve your look.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiMatchMutation.data.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
