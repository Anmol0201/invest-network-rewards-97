import React, { useState, useEffect } from "react";
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

// Data will be fetched from backend

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("news");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [adsData, setAdsData] = useState<any[]>([]);
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [newsRes, adsRes, bannersRes] = await Promise.all([
          fetch("/api/news", { headers }),
          fetch("/api/advertisements/active", { headers }),
          fetch("/api/banners/active", { headers }),
        ]);

        if (!newsRes.ok) throw new Error("Failed to fetch news");
        if (!adsRes.ok) throw new Error("Failed to fetch ads");
        if (!bannersRes.ok) throw new Error("Failed to fetch banners");

        const newsJson = await newsRes.json();
        const adsJson = await adsRes.json();
        const bannersJson = await bannersRes.json();

        setNewsData(Array.isArray(newsJson) ? newsJson : newsJson.data || []);
        setAdsData(Array.isArray(adsJson) ? adsJson : adsJson.data || []);
        setBannersData(
          Array.isArray(bannersJson) ? bannersJson : bannersJson.data || []
        );
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "Draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "Active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News Article</SelectItem>
                    <SelectItem value="ad">Advertisement</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter content title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter content description"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
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
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {article.content}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{article.publishDate}</TableCell>
                    <TableCell>{article.views.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
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
