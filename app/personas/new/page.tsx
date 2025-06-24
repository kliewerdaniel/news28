"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import yaml from "js-yaml";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  curiosity: z.number().min(0).max(1),
  empathy: z.number().min(0).max(1),
  skepticism: z.number().min(0).max(1),
  humor: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
});

export default function CreatePersonaPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      curiosity: 0.5,
      empathy: 0.5,
      skepticism: 0.5,
      humor: 0.5,
      confidence: 0.5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const yamlString = yaml.dump(values);
    console.log("Persona YAML:", yamlString);
    // In a real application, you would send this to an API or save to a file
  }

  const traits = [
    { name: "curiosity", label: "Curiosity" },
    { name: "empathy", label: "Empathy" },
    { name: "skepticism", label: "Skepticism" },
    { name: "humor", label: "Humor" },
    { name: "confidence", label: "Confidence" },
  ] as const; // Ensure type safety for trait names

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-blue-200 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create New Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {traits.map((trait) => (
                <FormField
                  key={trait.name}
                  control={form.control}
                  name={trait.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">{trait.label}</FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl className="flex-grow">
                          <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <span className="w-12 text-right text-sm font-mono">
                          {field.value.toFixed(2)}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full">
                Save Persona
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
