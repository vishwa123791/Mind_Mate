class ApiClient {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Chatbot API methods
  async sendChatMessage(message, sessionId) {
    return this.request("/chat", {
      method: "POST",
      body: { message, sessionId },
    })
  }

  // Booking API methods
  async getCounselors() {
    return this.request("/bookings?action=counselors")
  }

  async createBooking(bookingData) {
    return this.request("/bookings", {
      method: "POST",
      body,
    })
  }

  async getUserBookings(userId) {
    return this.request(`/bookings?action=user-bookings&userId=${userId}`)
  }

  async updateBooking(bookingId, updates) {
    return this.request("/bookings", {
      method: "PUT",
      body: { bookingId, ...updates },
    })
  }

  async cancelBooking(bookingId) {
    return this.request(`/bookings?id=${bookingId}`, {
      method: "DELETE",
    })
  }

  // Resources API methods
  async getResources(category = "all", language = "en") {
    return this.request(`/resources?category=${category}&language=${language}`)
  }

  async getRecommendations(userId) {
    return this.request(`/resources?action=recommendations&userId=${userId}`)
  }

  async logResourceView(resourceId, userId) {
    return this.request("/resources", {
      method: "POST",
      body: { resourceId, userId, action: "view" },
    })
  }

  async downloadResource(resourceId, userId) {
    return this.request("/resources", {
      method: "POST",
      body: { resourceId, userId, action: "download" },
    })
  }

  // Forum API methods
  async getForumPosts(category = "all") {
    return this.request(`/forum?category=${category}`)
  }

  async getForumPost(postId) {
    return this.request(`/forum?postId=${postId}`)
  }

  async createForumPost(postData) {
    return this.request("/forum", {
      method: "POST",
      body: { action: "create-post", ...postData },
    })
  }

  async createForumReply(replyData) {
    return this.request("/forum", {
      method: "POST",
      body: { action: "create-reply", ...replyData },
    })
  }

  async upvoteContent(id, type) {
    return this.request("/forum", {
      method: "POST",
      body: { action: "upvote", id, type },
    })
  }

  // Admin API methods
  async getAnalytics(timeframe = "30d") {
    return this.request(`/admin/analytics?timeframe=${timeframe}`)
  }

  async getAnalyticsMetric(metric, timeframe = "30d") {
    return this.request(`/admin/analytics?metric=${metric}&timeframe=${timeframe}`)
  }

  async exportReport(timeframe) {
    return this.request("/admin/analytics", {
      method: "POST",
      body: { action: "export-report", timeframe },
    })
  }

  async updateAlertStatus(alertId, status) {
    return this.request("/admin/analytics", {
      method: "POST",
      body: { action: "update-alert-status", alertId, status },
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient

