import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Hire a Private Investigator Safely",
    excerpt: "Tips and tricks for finding a verified professional for your case.",
    date: "Nov 20, 2025",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Top 5 Myths About Private Eyes",
    excerpt: "We debunk common misconceptions about the PI industry.",
    date: "Nov 15, 2025",
    category: "Industry",
    image: "https://images.unsplash.com/photo-1595852879736-2247b25533c8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Digital Forensics: The New Frontier",
    excerpt: "How cyber investigations are changing the landscape of detective work.",
    date: "Nov 10, 2025",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="Blog" description="Latest news, tips, and insights from the world of private investigation." />
      <Navbar />
      <main className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-12 mt-16">
        <h1 className="text-4xl font-bold font-heading mb-6">Latest Insights</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Stay up to date with the latest trends, tips, and news from the private investigation industry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
