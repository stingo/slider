import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const dummyArticles = [
  {
    title: "How to List and Sell Products on Upfrica",
    summary: "Learn how to create listings, manage your inventory, and attract buyers on Upfrica.",
    url: "/help/how-to-sell",
  },
  {
    title: "Understanding Upfrica's Seller Fees",
    summary: "A simple breakdown of Upfrica's commission, payment methods, and withdrawal process.",
    url: "/help/seller-fees",
  },
  {
    title: "Start a Clothing Brand on Upfrica",
    summary: "From sourcing to marketing, here’s how to start and grow your clothing brand.",
    url: "/blog/start-clothing-brand",
  },
  {
    title: "Top 10 Products Selling in Ghana & Nigeria",
    summary: "We analyzed trending categories and buyer habits on Upfrica.",
    url: "/blog/top-products-ghana-nigeria",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-8 md:px-20 lg:px-40">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Upfrica Help Center & Blog</h1>
        <p className="text-gray-600 text-lg">
          Learn how to succeed on Upfrica, explore insights, tips and platform updates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {dummyArticles.map((article, index) => (
          <Card key={index} className="hover:shadow-xl transition-all cursor-pointer">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-primary">
                <Link href={article.url}>{article.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4">{article.summary}</p>
              <Link href={article.url}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
