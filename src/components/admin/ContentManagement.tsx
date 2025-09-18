import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image,
  FileText,
  Megaphone,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AdminService from "@/services/adminService";
import { apiClient } from "@/lib/api";

// Data will be fetched from backend

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("news");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [adsData, setAdsData] = useState<any[]>([]);
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [contentType, setContentType] = useState<"news" | "ad" | "banner">("news");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<
    "technology" | "business" | "sports" | "entertainment" | "health" | "science" | "politics" | "world"
  >("technology");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const resetForm = () => {
    setContentType("news");
    setTitle("");
    setContent("");
    setCategory("technology");
    setSummary("");
    setImageUrl("");
  };

  const safeDate = (d: any) => {
    try {
      if (!d) return "";
      if (typeof d === "string") return new Date(d).toLocaleDateString();
      if (d?.seconds) return new Date(d.seconds * 1000).toLocaleDateString();
      return new Date(d).toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [newsRes, adsRes, bannersRes] = await Promise.all([
        apiClient.get("/news"),
        apiClient.get("/advertisements/active"),
        apiClient.get("/banners/active"),
      ]);

      if (!newsRes.success) throw new Error(newsRes.message || "Failed to fetch news");
      if (!adsRes.success) throw new Error(adsRes.message || "Failed to fetch ads");
      if (!bannersRes.success) throw new Error(bannersRes.message || "Failed to fetch banners");

      const news = (newsRes.data as any)?.news || (newsRes.data as any)?.data?.news || [];
      const ads = (adsRes.data as any)?.advertisements || (adsRes.data as any)?.data?.advertisements || [];
      const banners = (bannersRes.data as any)?.banners || (bannersRes.data as any)?.data?.banners || [];

      setNewsData(Array.isArray(news) ? news : []);
      setAdsData(Array.isArray(ads) ? ads : []);
      setBannersData(Array.isArray(banners) ? banners : []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (status) {
      case "Published":
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "Draft":
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "Active":
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "Inactive":
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge>{status || "-"}</Badge>;
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!title.trim()) throw new Error("Title is required");

      if (contentType === "news") {
        const finalSummary = summary.trim() || content.trim().slice(0, 200);
        if (!content.trim()) throw new Error("Content is required for news");
        await AdminService.createNewsArticle({
          title: title.trim(),
          content: content.trim(),
          summary: finalSummary,
          author: { name: "Admin" },
          category,
          source: { name: "WeNews" },
          language: "en",
          status: "published",
        });
        await fetchAll();
        resetForm();
        setIsDialogOpen(false);
        return;
      }

      if (contentType === "ad") {
        // Minimal fields: title (required), description optional
        const res = await apiClient.post("/advertisements", {
          title: title.trim(),
          description: content.trim() || undefined,
          status: "active",
          placement: "dashboard",
          type: "banner",
        });
        if (!res.success) throw new Error(res.message || "Failed to create advertisement");
        await fetchAll();
        resetForm();
        setIsDialogOpen(false);
        return;
      }

      if (contentType === "banner") {
        if (!imageUrl.trim()) throw new Error("Image URL is required for banner");
        const res = await apiClient.post("/banners", {
          title: title.trim(),
          description: content.trim() || undefined,
          imageUrl: imageUrl.trim(),
          placement: "homepage",
        });
        if (!res.success) throw new Error(res.message || "Failed to create banner");
        await fetchAll();
        resetForm();
        setIsDialogOpen(false);
        return;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Content Management
          </h2>
          <p className="text-gray-600">
            Manage news articles, advertisements, and marketing content
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={(v: any) => setContentType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News Article</SelectItem>
                    <SelectItem value="ad">Advertisement</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter content title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">{contentType === 'news' ? 'Content' : contentType === 'ad' ? 'Description' : 'Description (optional)'}</Label>
                <Textarea id="content" placeholder={contentType === 'news' ? 'Enter article content' : 'Enter description'} rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              {contentType === 'news' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Input id="summary" placeholder="Short summary (<= 500 chars)" value={summary} onChange={(e) => setSummary(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                        <SelectItem value="world">World</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {contentType === 'banner' && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCreate} disabled={loading}>
                  Create Content
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-blue-600">47</p>
                <p className="text-xs text-gray-500">15 published this month</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Ads</p>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-500">8 campaigns running</p>
              </div>
              <Megaphone className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-orange-600">24.5K</p>
                <p className="text-xs text-gray-500">+18% this month</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-purple-600">8.7%</p>
                <p className="text-xs text-gray-500">+2.3% improvement</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <Button
              variant={activeTab === "news" ? "default" : "outline"}
              onClick={() => setActiveTab("news")}
            >
              <FileText className="w-4 h-4 mr-2" />
              News Articles
            </Button>
            <Button
              variant={activeTab === "ads" ? "default" : "outline"}
              onClick={() => setActiveTab("ads")}
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Advertisements
            </Button>
            <Button
              variant={activeTab === "banners" ? "default" : "outline"}
              onClick={() => setActiveTab("banners")}
            >
              <Image className="w-4 h-4 mr-2" />
              Marketing Banners
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "news" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsData.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {article?.images?.[0] ? (
                          <img src={article.images[0]} alt={article.title} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded" />
                        )}
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {article.summary || article.content}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article?.author?.name || '-'}</TableCell>
                    <TableCell>{safeDate(article?.publishDate)}</TableCell>
                    <TableCell>{(article?.views ?? 0).toLocaleString?.() || String(article?.views ?? 0)}</TableCell>
                    <TableCell>{getStatusBadge(article?.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === "ads" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adsData.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ad.title}</p>
                        <p className="text-sm text-gray-500">
                          {ad.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ad.type}</Badge>
                    </TableCell>
                    <TableCell>{ad.placement}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{ad.startDate}</p>
                        <p className="text-gray-500">to {ad.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Clicks: {ad.clicks.toLocaleString()}</p>
                        <p className="text-gray-500">
                          CTR: {((ad.clicks / ad.impressions) * 100).toFixed(2)}
                          %
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ad.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Switch checked={ad.status === "Active"} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === "banners" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bannersData.length === 0 && (
                  <div className="text-center text-gray-500 col-span-full">
                    No banners found
                  </div>
                )}
                {bannersData.map((banner) => (
                  <Card key={banner.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{banner.title}</h4>
                        <p className="text-sm text-gray-500">
                          {banner.placement || "Homepage placement"}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge
                            className={
                              banner.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Banner Card */}
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                    <Button
                      variant="ghost"
                      className="h-full w-full flex-col space-y-2"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-500">Add New Banner</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Content Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">
                Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use engaging headlines and clear descriptions</li>
                <li>• Include relevant keywords for better visibility</li>
                <li>• Optimize images for web (max 500KB)</li>
                <li>• Schedule content for optimal engagement times</li>
                <li>• Monitor performance and adjust accordingly</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-600 mb-3">
                Content Requirements
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All content must be family-friendly</li>
                <li>• Financial advice must be disclaimered</li>
                <li>• Images must have proper licensing</li>
                <li>• Maintain consistent brand voice</li>
                <li>• Review content before publishing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
