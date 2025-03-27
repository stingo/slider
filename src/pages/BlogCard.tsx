// src/pages/BlogCard.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  title: string;
  summary: string;
  url: string;
}

const BlogCard = ({ title, summary, url }: BlogCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="space-y-3 p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-sm">{summary}</p>
        <Link href={url}>
          <Button variant="outline" className="mt-2 text-sm">
            Read More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;