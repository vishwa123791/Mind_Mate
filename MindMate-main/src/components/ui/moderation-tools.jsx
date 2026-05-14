"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Textarea } from "./textarea"

export function ModerationTools({ post, onAction }) {
  const [reportReason, setReportReason] = useState("")
  const [showReportForm, setShowReportForm] = useState(false)

  const moderationActions = [
    { id: "helpful", label: "This helped me", icon: "ðŸ‘", color: "green" },
    { id: "report", label: "Report", icon: "âš ï¸", color: "red" },
    { id: "support", label: "Send support", icon: "ðŸ’™", color: "blue" },
  ]

  const reportReasons = [
    "Harmful or dangerous content",
    "Spam or irrelevant",
    "Harassment or bullying",
    "Crisis situation - needs immediate help",
    "Other",
  ]

  const handleReport = () => {
    onAction("report", { reason, postId.id })
    setShowReportForm(false)
    setReportReason("")
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {moderationActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={() => {
              if (action.id === "report") {
                setShowReportForm(true)
              } else {
                onAction(action.id, { postId.id })
              }
            }}
            className="text-xs"
          >
            <span className="mr-1">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>

      {showReportForm && (
        <Card className="border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive">Report this post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label key={reason} className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {reportReason === "Other" && (
              <Textarea
                placeholder="Please describe the issue..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
              />
            )}

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowReportForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleReport} disabled={!reportReason} className="bg-destructive">
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

