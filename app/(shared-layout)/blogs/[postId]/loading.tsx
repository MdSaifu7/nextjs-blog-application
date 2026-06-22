import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-72 w-full rounded-xl bg-muted mb-8" />

      {/* Title Skeleton */}
      <div className="h-10 w-3/4 bg-muted rounded mb-4" />

      {/* Author & Date */}
      <div className="flex gap-4 mb-8">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-5 w-32 bg-muted rounded" />
      </div>

      {/* Content Skeleton */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </CardContent>
      </Card>
    </div>
  );
}
