"use client";
import { postFormSchema } from "@/app/schema/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlogAction, getUploadUrlAction } from "@/app/actions";

type blogValue = z.infer<typeof postFormSchema>;
const createRoute = () => {
  const router = useRouter();
  // const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const [isPending, startTransition] = useTransition();
  // const mutation = useMutation(api.posts.createPost);
  const form = useForm<blogValue>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });
  const onSubmit = (data: blogValue) => {
    startTransition(async () => {
   
      const { uploadUrl, error: urlError } = await getUploadUrlAction();
      if (urlError || !uploadUrl) {
        toast.error(urlError || "Failed to get upload URL");
        return;
      }
      // const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": data.image.type,
        },
        body: data.image,
      });
      if (!result.ok) {
        toast.error("Failed to upload image to storage");
        return;
      }
      const { storageId } = await result.json();

      await createBlogAction({
        title: data.title,
        content: data.content,
        storageId,
      });
      toast.success("Blog created successfully");
      form.reset();
      router.push("/blogs");
    });
  };
  return (
    <div className="py-7 mt-8 w-full border-b flex flex-col bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create a new blog post
        </h1>
        <p className="text-sm text-muted-foreground">
          Share your thoughts with the world. Fill out the fields below to get
          started.
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto rounded-xl mt-5 bg-background">
        <CardHeader>
          <CardTitle className="text-center">Create Blog Article</CardTitle>
          <CardDescription className="text-center px-4 py-2">
            Create a new blog article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-3">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field className="gap-y-0">
                      <FieldLabel>Title</FieldLabel>
                      <Input
                        aria-invalid={fieldState.invalid}
                        {...field}
                      ></Input>
                      {fieldState.error && (
                        <>
                          <FieldError errors={[fieldState.error]} />
                        </>
                      )}
                    </Field>
                  );
                }}
              ></Controller>

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel>Content</FieldLabel>
                      <Textarea
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your content..."
                        className="w-full min-h-[120px] rounded-md border border-input  px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive"
                        {...field}
                      />
                      {fieldState.error && (
                        <>
                          <FieldError errors={[fieldState.error]} />
                        </>
                      )}
                    </Field>
                  );
                }}
              ></Controller>

              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel>Image</FieldLabel>

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Button disabled={isPending} className="rounded-xl" type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 spin-in" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Create post"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default createRoute;
