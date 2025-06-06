
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import NextImage from 'next/image'; // Renamed to avoid conflict with global Image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generatePoemAction } from './actions';
import { UploadCloud, Share2, Download, Loader2, AlertTriangle, Feather } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const poemStyles = ["Haiku", "Free Verse", "Sonnet", "Limerick", "Ode", "Ballad", "Rhyming Couplets", "Acrostic", "Cinquain", "Tanka"];

export default function HomePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(poemStyles[1]); // Default to Free Verse
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size to 4MB (adjust as needed for Genkit)
        setError("Image size should be less than 4MB.");
        toast({
          title: "Image Too Large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedPoem(null); 
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Please upload an image first.");
      toast({
          title: "No Image",
          description: "Please upload an image to generate a poem.",
          variant: "destructive",
        });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPoem(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        const imageDataUri = reader.result as string;
        const result = await generatePoemAction({
          photoDataUri: imageDataUri,
          poemStyle: selectedStyle,
        });

        if ('error' in result) {
          setError(result.error);
          toast({
            title: "Poem Generation Failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          setGeneratedPoem(result.poem);
           toast({
            title: "Poem Generated!",
            description: "Your poem is ready.",
          });
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        const readError = "Failed to read image file.";
        setError(readError);
        toast({
          title: "Image Read Error",
          description: readError,
          variant: "destructive",
        });
        setIsLoading(false);
      };
    } catch (e: any) {
      const unexpectedError = e.message || "An unexpected error occurred during poem generation.";
      setError(unexpectedError);
      toast({
          title: "Error",
          description: unexpectedError,
          variant: "destructive",
        });
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && imagePreview && generatedPoem) {
      // Sharing image file directly can be complex and browser-dependent.
      // Sharing text (poem) and a link to the image (if hosted) is more reliable.
      // For this local app, we'll just share the text.
      navigator.share({
        title: 'My Pic2Poem Creation',
        text: `I created a ${selectedStyle.toLowerCase()} poem from a picture!\n\n${generatedPoem}\n\nCheck out Pic2Poem!`,
      }).then(() => {
        toast({ title: "Shared successfully!"});
      })
      .catch((shareError) => {
        console.error('Error sharing:', shareError);
        toast({ title: "Sharing failed", description: "Could not share content.", variant: "destructive"});
      });
    } else {
      toast({ title: "Nothing to share", description: "Generate an image and poem first, or your browser may not support sharing.", variant: "destructive"});
    }
  };

  const handleSave = () => {
    let savedSomething = false;
    if (generatedPoem) {
      const blob = new Blob([generatedPoem], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `Pic2Poem_${selectedStyle.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      savedSomething = true;
    }

    if (imagePreview && imageFile) {
      const link = document.createElement('a');
      link.href = imagePreview; // This is a data URI
      link.download = imageFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      savedSomething = true;
    }
    
    if (savedSomething) {
        toast({ title: "Content Saved", description: "Image and/or poem downloaded."});
    } else {
        toast({ title: "Nothing to Save", description: "Please generate a poem or upload an image first.", variant: "destructive"});
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 md:mb-12 text-center">
        <div className="flex items-center justify-center gap-3">
          <Feather className="h-12 w-12 md:h-16 md:w-16 text-primary" />
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary">Pic2Poem</h1>
        </div>
        <p className="text-muted-foreground mt-3 text-md md:text-lg font-body">Transform your cherished photos into beautiful poetic verses.</p>
      </header>

      <Card className="w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-primary/10 border-b border-primary/20 p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary/90">Craft Your Poem</CardTitle>
            <CardDescription className="font-body text-muted-foreground text-base">Upload an image, select a poetic style, and let the magic unfold.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div className="space-y-6 p-1 rounded-lg">
                <div>
                  <Label htmlFor="image-upload" className="text-lg font-medium block mb-2 font-body">Upload Your Image</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-accent/50 hover:border-accent transition-colors">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground/70" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                        >
                          <span>Upload a file</span>
                          <Input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF up to 4MB</p>
                    </div>
                  </div>
                  {imageFile && <p className="mt-2 text-sm text-muted-foreground font-body">Selected: {imageFile.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="poem-style" className="text-lg font-medium block mb-2 font-body">Choose Poem Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger id="poem-style" className="w-full text-base py-3 h-auto">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {poemStyles.map(style => (
                        <SelectItem key={style} value={style} className="text-base">{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6 rounded-md shadow-md hover:shadow-lg transition-shadow" disabled={isLoading || !imageFile}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Poem...
                    </>
                  ) : "Generate Poem"}
                </Button>
              </div>

              <div className="space-y-6 p-1 rounded-lg">
                {imagePreview && (
                  <div>
                    <h3 className="text-xl font-headline mb-3 text-foreground/90">Your Image</h3>
                    <div className="aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-9 relative w-full rounded-lg overflow-hidden border-2 border-border shadow-lg">
                      <NextImage src={imagePreview} alt="Uploaded preview" layout="fill" objectFit="contain" data-ai-hint="user uploaded image" />
                    </div>
                  </div>
                )}

                {isLoading && !generatedPoem && !imagePreview && (
                   <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-4 text-muted-foreground">
                    <Feather className="h-16 w-16 text-primary/50 mb-4 animate-pulse" />
                    <p className="font-body">Upload an image to get started...</p>
                  </div>
                )}
                
                {isLoading && !generatedPoem && imagePreview && (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-4 text-muted-foreground">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                    <p className="font-body text-lg">Crafting your poetic masterpiece...</p>
                    <p className="font-body text-sm">This might take a moment.</p>
                  </div>
                )}

                {generatedPoem && !isLoading && (
                  <div>
                    <h3 className="text-xl font-headline mb-3 text-foreground/90">{selectedStyle} Poem</h3>
                    <Textarea
                      readOnly
                      value={generatedPoem}
                      className="h-72 font-body text-base bg-muted/20 border-muted-foreground/30 rounded-md shadow-inner p-4 leading-relaxed resize-none"
                      aria-label="Generated Poem"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-destructive/10 text-destructive border border-destructive/30 rounded-md flex items-center gap-3 shadow-sm">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <p className="font-body text-sm">{error}</p>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-secondary/30 border-t border-border">
             <Button variant="outline" onClick={handleShare} disabled={!imagePreview || !generatedPoem || isLoading} className="gap-2 shadow-sm hover:shadow-md transition-shadow rounded-md">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={(!imagePreview && !generatedPoem) || isLoading} className="gap-2 shadow-sm hover:shadow-md transition-shadow rounded-md">
              <Download className="h-4 w-4" /> Save
            </Button>
          </CardFooter>
        </form>
      </Card>

      <footer className="mt-12 md:mt-16 text-center text-muted-foreground/80">
        <p className="font-body text-sm">&copy; {new Date().getFullYear()} Pic2Poem. Created with creativity and code.</p>
      </footer>
    </div>
  );
}
