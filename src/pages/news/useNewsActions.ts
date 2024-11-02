import { useCallback, useState } from "react";
import { message } from "antd";
import { NewsInfo, NewsRequest } from "../../api/api.types"; // Adjust the path as needed
import { CreateNews, DeleteNews, GetNewsInfo, UpdateNews } from "../../api/news";


export function useNewsActions(newsId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [news, setNews] = useState<NewsInfo | null>(null);

  // Fetch news details
  const fetchNews = useCallback(async () => {
    if (!newsId) return;
    setLoading(true);
    try {
      const response = await GetNewsInfo(newsId);
      setNews(response.data);
    } catch (error) {
      message.error("Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  // Create news
  const createNews = useCallback(async (data: NewsRequest) => {
    setLoading(true);
    try {
      const response = await CreateNews(data);
      message.success("News created successfully");
      return response.data;
    } catch (error) {
      message.error("Failed to create news");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update news
  const updateNews = useCallback(async (id: string, updatedData: NewsRequest) => {
    if (!newsId) return;
    setLoading(true);
    try {
      await UpdateNews(id, updatedData);
      message.success("News updated successfully.");
      return true;
    } catch (error) {
      message.error("Failed to update news.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  const deleteNews = useCallback(async () => {
    if (!newsId) return;
    setLoading(true);
    try {
      await DeleteNews(newsId);
      message.success("News delete successfully.");
      return true;
    } catch (error) {
      message.error("Failed to delete news.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  return { news, loading, fetchNews, createNews, updateNews, deleteNews };
}